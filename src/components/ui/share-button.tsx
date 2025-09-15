import React, { useState } from 'react';
import { Button } from './button';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Mail, 
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Speeltuinen Castricum',
  description = 'Ontdek alle speeltuinen in Castricum! Complete gids met interactieve kaart.',
  className,
  variant = 'default',
  size = 'default'
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    title,
    text: description,
    url
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled or error occurred, show fallback
        if (error instanceof Error && error.name !== 'AbortError') {
          setShowFallback(true);
        }
      }
    } else {
      setShowFallback(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
  };

  if (showFallback) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(shareLinks.whatsapp, '_blank')}
            className="bg-white/90 hover:bg-green-50 border-green-200 hover:border-green-300"
          >
            <MessageCircle className="w-4 h-4 text-green-600" />
            WhatsApp
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(shareLinks.facebook, '_blank')}
            className="bg-white/90 hover:bg-blue-50 border-blue-200 hover:border-blue-300"
          >
            <Facebook className="w-4 h-4 text-blue-600" />
            Facebook
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(shareLinks.twitter, '_blank')}
            className="bg-white/90 hover:bg-sky-50 border-sky-200 hover:border-sky-300"
          >
            <Twitter className="w-4 h-4 text-sky-600" />
            Twitter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(shareLinks.linkedin, '_blank')}
            className="bg-white/90 hover:bg-blue-50 border-blue-200 hover:border-blue-300"
          >
            <Linkedin className="w-4 h-4 text-blue-700" />
            LinkedIn
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(shareLinks.email)}
            className="bg-white/90 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
          >
            <Mail className="w-4 h-4 text-gray-600" />
            Email
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="bg-white/90 hover:bg-gray-50 border-gray-200 hover:border-gray-300 mx-auto"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Gekopieerd!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Link kopiëren
            </>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFallback(false)}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          Terug
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleNativeShare}
      className={cn(
        "bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 backdrop-blur-sm",
        className
      )}
    >
      <Share2 className="w-4 h-4" />
      Deel deze pagina
    </Button>
  );
};