import { Injectable } from '@angular/core';
import { Product } from '../types/product';
import { environment } from '../../environments/environment';

export interface SocialPlatform {
  name: string;
  icon: string;
  color: string;
  shareUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocialShareService {

  private platforms: SocialPlatform[] = [
    {
      name: 'Facebook',
      icon: 'facebook',
      color: '#1877F2',
      shareUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}&quote={text}'
    },
    {
      name: 'Twitter',
      icon: 'twitter',
      color: '#1DA1F2',
      shareUrl: 'https://twitter.com/intent/tweet?url={url}&text={text}&hashtags={hashtags}'
    },
    {
      name: 'WhatsApp',
      icon: 'whatsapp',
      color: '#25D366',
      shareUrl: 'https://wa.me/?text={text}%20{url}'
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      color: '#0A66C2',
      shareUrl: 'https://www.linkedin.com/sharing/share-offsite/?url={url}'
    },
    {
      name: 'Pinterest',
      icon: 'pinterest',
      color: '#E60023',
      shareUrl: 'https://pinterest.com/pin/create/button/?url={url}&media={image}&description={text}'
    },
    {
      name: 'Telegram',
      icon: 'telegram',
      color: '#0088CC',
      shareUrl: 'https://t.me/share/url?url={url}&text={text}'
    }
  ];

  constructor() { }

  getPlatforms(): SocialPlatform[] {
    return this.platforms;
  }

  shareProduct(product: Product, platform: string): void {
    const baseUrl = environment.frontendUrl || window.location.origin;
    const productUrl = `${baseUrl}/product/${product._id}`;
    const productImage = product.images && product.images.length > 0 ? String(product.images[0]) : '';
    
    // Enhanced share text with emojis and more engaging content
    const shareText = `🛍️ Check out this amazing product: ${String(product.name)} 
    
✨ ${String(product.shotDescription)}
🔥 ${Number(product.discount)}% OFF - Limited time!
💝 Perfect find for you!`;
    
    const hashtags = 'shopping,deals,ecommerce,fashion,lifestyle';
    
    const platformConfig = this.platforms.find(p => p.name.toLowerCase() === platform.toLowerCase());
    
    if (!platformConfig) {
      console.error('Platform not found:', platform);
      return;
    }

    let shareUrl = platformConfig.shareUrl
      .replace('{url}', encodeURIComponent(productUrl))
      .replace('{text}', encodeURIComponent(shareText))
      .replace('{hashtags}', encodeURIComponent(hashtags))
      .replace('{image}', encodeURIComponent(productImage));

    // Open in new window with enhanced settings
    const popup = window.open(
      shareUrl, 
      '_blank', 
      'width=650,height=500,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
    );
    
    // Focus the popup window
    if (popup) {
      popup.focus();
    }
  }

  copyToClipboard(product: Product): Promise<boolean> {
    const baseUrl = environment.frontendUrl || window.location.origin;
    const productUrl = `${baseUrl}/product/${product._id}`;
    const shareText = `🛍️ Check out this amazing product: ${String(product.name)}

✨ ${String(product.shotDescription)}
🔥 ${Number(product.discount)}% OFF - Limited time!

🔗 Shop now: ${productUrl}

#shopping #deals #fashion`;

    return navigator.clipboard.writeText(shareText).then(() => {
      return true;
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    });
  }

  // Method to copy only the product link (not the full share text)
  copyProductLink(product: Product): Promise<boolean> {
    const baseUrl = environment.frontendUrl || window.location.origin;
    const productUrl = `${baseUrl}/product/${product._id}`;

    return navigator.clipboard.writeText(productUrl).then(() => {
      return true;
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = productUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    });
  }

  // Method to share via native Web Share API (if available)
  async nativeShare(product: Product): Promise<boolean> {
    if (!navigator.share) {
      return false;
    }

    const baseUrl = environment.frontendUrl || window.location.origin;
    const productUrl = `${baseUrl}/product/${product._id}`;

    try {
      await navigator.share({
        title: String(product.name),
        text: `Check out this amazing product: ${String(product.name)}`,
        url: productUrl
      });
      return true;
    } catch (error) {
      console.error('Native sharing failed:', error);
      return false;
    }
  }
}
