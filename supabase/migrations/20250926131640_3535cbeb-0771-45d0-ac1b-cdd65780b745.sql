-- Fix audit trigger to handle tables without id column and add admin role
-- First, update the audit trigger function to handle tables without id column
CREATE OR REPLACE FUNCTION public.audit_table_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    record_id_value TEXT;
BEGIN
    -- Try to get record ID, fall back to user_id for user_roles table, or generate a unique identifier
    IF TG_TABLE_NAME = 'user_roles' THEN
        record_id_value := COALESCE(NEW.user_id::text, OLD.user_id::text);
    ELSE
        -- For other tables, try to use id column or fall back to a generated value
        BEGIN
            IF TG_OP = 'DELETE' THEN
                record_id_value := (row_to_json(OLD)->>'id')::text;
            ELSE
                record_id_value := (row_to_json(NEW)->>'id')::text;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            -- If no id column exists, use table name + timestamp
            record_id_value := TG_TABLE_NAME || '_' || extract(epoch from now())::text;
        END;
    END IF;

    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (
            table_name,
            action,
            record_id,
            old_values,
            user_id,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            TG_OP,
            record_id_value,
            to_jsonb(OLD),
            auth.uid(),
            inet_client_addr()
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (
            table_name,
            action,
            record_id,
            old_values,
            new_values,
            user_id,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            TG_OP,
            record_id_value,
            to_jsonb(OLD),
            to_jsonb(NEW),
            auth.uid(),
            inet_client_addr()
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (
            table_name,
            action,
            record_id,
            new_values,
            user_id,
            ip_address
        ) VALUES (
            TG_TABLE_NAME,
            TG_OP,
            record_id_value,
            to_jsonb(NEW),
            auth.uid(),
            inet_client_addr()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$function$;

-- Now add the admin role for the current user
INSERT INTO public.user_roles (user_id, role)
VALUES ('76769119-2708-4da9-a661-fb3011f18ed3', 'admin');