import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SocialShareService, SocialPlatform } from '../../services/social-share.service';
import { Product } from '../../types/product';

@Component({
  selector: 'app-social-share',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule,
    MatSnackBarModule
  ],
  template: `
    <div class="social-share-container">
      <!-- Icon-only Share Button for Cards -->
      <button 
        *ngIf="iconOnly"
        mat-icon-button 
        [matMenuTriggerFor]="shareMenu"
        class="share-button-icon-only"
        title="Share this product"
        aria-label="Share product">
        <mat-icon>share</mat-icon>
      </button>

      <!-- Full Share Button with Text for Product Detail -->
      <button 
        *ngIf="!iconOnly && showText"
        mat-raised-button 
        color="primary"
        [matMenuTriggerFor]="shareMenu"
        class="share-button-with-text">
        <mat-icon>share</mat-icon>
        <span class="share-text">Share</span>
      </button>

      <!-- Stylish Share Button (gradient) for Product Detail -->
      <button 
        *ngIf="!iconOnly && !showText"
        mat-icon-button 
        [matMenuTriggerFor]="shareMenu"
        class="share-button-minimal"
        title="Share this product"
        aria-label="Share product">
        <mat-icon>share</mat-icon>
      </button>

      <!-- Enhanced Share Menu -->
      <mat-menu #shareMenu="matMenu" class="share-menu" xPosition="before" yPosition="below">
        <!-- Native Share (if available) -->
        <button 
          mat-menu-item 
          (click)="handleNativeShare()"
          *ngIf="supportsNativeShare"
          class="platform-button native-share">
          <mat-icon style="color: #FF6B35;">mobile_screen_share</mat-icon>
          <span>Share via device</span>
        </button>

        <!-- Top Social Platforms with enhanced styling -->
        <ng-container *ngFor="let platform of platforms.slice(0, 3); let i = index">
          <button 
            mat-menu-item 
            (click)="shareOnPlatform(platform.name)"
            class="platform-button"
            [attr.data-platform]="platform.name.toLowerCase()">
            <mat-icon [style.color]="platform.color">{{ getPlatformIcon(platform.icon) }}</mat-icon>
            <span>Share on {{ platform.name }}</span>
          </button>
        </ng-container>

        <!-- Copy Link with special styling -->
        <button 
          mat-menu-item 
          (click)="copyLink()"
          class="copy-button">
          <mat-icon style="color: #4CAF50;">content_copy</mat-icon>
          <span>Copy product link</span>
        </button>

        <!-- More Options with subtle separator -->
        <button 
          mat-menu-item 
          [matMenuTriggerFor]="moreMenu"
          *ngIf="platforms.length > 3"
          class="platform-button more-options">
          <mat-icon style="color: #9E9E9E;">more_horiz</mat-icon>
          <span>More sharing options</span>
        </button>
      </mat-menu>

      <!-- Additional Platforms Menu -->
      <mat-menu #moreMenu="matMenu" class="share-menu">
        <ng-container *ngFor="let platform of platforms.slice(3)">
          <button 
            mat-menu-item 
            (click)="shareOnPlatform(platform.name)"
            class="platform-button">
            <mat-icon [style.color]="platform.color">{{ getPlatformIcon(platform.icon) }}</mat-icon>
            <span>Share on {{ platform.name }}</span>
          </button>
        </ng-container>
      </mat-menu>
    </div>
  `,
  styles: [`
    .social-share-container {
      display: inline-block;
      position: relative;
    }

    /* Icon-only button for product cards - Material Design Blue */
    .share-button-icon-only {
      width: 40px;
      height: 40px;
      min-height: 40px;
      color: #ffffff !important;
      background: #1976d2 !important; /* Material primary blue */
      border: none !important;
      border-radius: 50%;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
      cursor: pointer;
    }

    .share-button-icon-only:hover {
      background: #1565c0 !important; /* Darker primary blue on hover */
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
    }

    .share-button-icon-only:active {
      transform: translateY(0) scale(1.02);
      transition: transform 0.1s ease;
    }

    .share-button-icon-only .mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      transition: transform 0.2s ease;
    }

    .share-button-icon-only:hover .mat-icon {
      transform: scale(1.1);
    }

    /* Share button with text for product detail */
    .share-button-with-text {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .share-button-with-text:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    }

    .share-text {
      font-weight: 500;
    }

    /* Gradient button (stylish minimal) */
    .share-button-minimal {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      position: relative;
      overflow: hidden;
    }

    .share-button-minimal::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }

    .share-button-minimal:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
    }

    .share-button-minimal:hover::before {
      left: 100%;
    }

    .share-button-minimal:active {
      transform: translateY(0) scale(0.98);
    }

    .share-menu {
      max-width: 220px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
    }

    .platform-button,
    .copy-button {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .platform-button::before,
    .copy-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition: left 0.3s;
    }

    .platform-button:hover,
    .copy-button:hover {
      background: rgba(0, 0, 0, 0.04);
      transform: translateX(4px);
    }

    .platform-button:hover::before,
    .copy-button:hover::before {
      left: 100%;
    }

    /* Platform-specific hover colors */
    .platform-button:hover {
      background: linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.06));
    }

    /* Reduce icon size for better proportion */
    .mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      transition: transform 0.2s ease;
    }

    .platform-button:hover .mat-icon,
    .copy-button:hover .mat-icon {
      transform: scale(1.1);
    }

    /* Menu item text styling */
    .platform-button span,
    .copy-button span {
      font-weight: 500;
      font-size: 14px;
      color: #333;
    }

    /* Divider between sections */
    .mat-menu-item + .mat-menu-item {
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    /* Copy button special styling */
    .copy-button {
      border-top: 2px solid rgba(0, 0, 0, 0.08);
      margin-top: 4px;
    }

    .copy-button:hover {
      background: linear-gradient(90deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.2));
    }

    .copy-button:hover .mat-icon {
      color: #4caf50;
    }

    /* Animation for menu appearance */
    .share-menu .mat-menu-content {
      padding: 8px 0;
    }

    /* Subtle pulse animation for the share button */
    @keyframes subtle-pulse {
      0% { box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); }
      50% { box-shadow: 0 2px 12px rgba(102, 126, 234, 0.4); }
      100% { box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); }
    }

    .share-button-minimal {
      animation: subtle-pulse 3s ease-in-out infinite;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .platform-button span,
      .copy-button span {
        color: #e0e0e0;
      }
      
      .share-menu {
        background: rgba(33, 33, 33, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .platform-button:hover,
      .copy-button:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    /* Card integration styles - Enhanced */
    .product-card .social-share-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    /* Floating effect on card hover */
    .product-card:hover .share-button-icon-only {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 
        0 6px 20px rgba(59, 130, 246, 0.2),
        0 3px 8px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    /* Ripple effect */
    .share-button-icon-only {
      position: relative;
      overflow: hidden;
    }

    .share-button-icon-only:focus {
      outline: none;
    }

    .share-button-icon-only:focus::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(59, 130, 246, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: ripple 0.6s ease-out;
    }

    @keyframes ripple {
      to {
        width: 80px;
        height: 80px;
        opacity: 0;
      }
    }

    /* Glow effect for special occasions */
    .share-button-icon-only.special-glow {
      animation: special-glow 2s ease-in-out infinite alternate;
    }

    @keyframes special-glow {
      from {
        box-shadow: 
          0 2px 8px rgba(0, 0, 0, 0.08),
          0 1px 3px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
      }
      to {
        box-shadow: 
          0 2px 8px rgba(0, 0, 0, 0.08),
          0 1px 3px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.8),
          0 0 20px rgba(59, 130, 246, 0.4),
          0 0 40px rgba(59, 130, 246, 0.2);
      }
    }

    /* Enhanced mobile responsiveness */
    @media (max-width: 768px) {
      .share-button-minimal {
        width: 32px;
        height: 32px;
      }
      
      .share-button-icon-only {
        width: 36px;
        height: 36px;
        min-height: 36px;
      }
      
      .share-button-icon-only .mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      
      .platform-button,
      .copy-button {
        padding: 10px 14px;
      }

      .share-button-icon-only:hover {
        transform: translateY(-2px) scale(1.05);
      }
    }

    /* Ultra-smooth transitions for premium feel */
    * {
      will-change: transform, opacity, box-shadow;
    }

    .share-button-icon-only * {
      transition: inherit;
    }
  `]
})
export class SocialShareComponent {
  @Input() product!: Product;
  @Input() showText: boolean = true; // New input to control text display
  @Input() iconOnly: boolean = false; // For card components

  socialShareService = inject(SocialShareService);
  snackBar = inject(MatSnackBar);

  platforms: SocialPlatform[] = [];
  supportsNativeShare: boolean = false;

  ngOnInit() {
    this.platforms = this.socialShareService.getPlatforms();
    this.supportsNativeShare = 'share' in navigator;
  }

  shareOnPlatform(platformName: string): void {
    this.socialShareService.shareProduct(this.product, platformName);
    this.showMessage(`🚀 Opening ${platformName} to share "${String(this.product.name)}"...`);
  }

  async handleNativeShare(): Promise<void> {
    const success = await this.socialShareService.nativeShare(this.product);
    if (!success) {
      this.showMessage('📱 Native sharing not available on this device', 'error');
    } else {
      this.showMessage('📤 Sharing options opened successfully!');
    }
  }

  async copyLink(): Promise<void> {
    const success = await this.socialShareService.copyProductLink(this.product);
    if (success) {
      this.showMessage('📋 Product link copied to clipboard! Ready to paste anywhere.');
    } else {
      this.showMessage('❌ Failed to copy link. Please try again.', 'error');
    }
  }

  getPlatformIcon(iconName: string): string {
    // Map social platform names to Material Icons
    const iconMap: { [key: string]: string } = {
      'facebook': 'facebook',
      'twitter': 'alternate_email',  // Twitter/X
      'whatsapp': 'chat',
      'linkedin': 'work',
      'pinterest': 'image',
      'telegram': 'send'
    };
    
    return iconMap[iconName] || 'share';
  }

  private showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar'
    });
  }
}
