import { generateTelegramLink } from '../utils/helpers';

class TelegramService {
  constructor() {
    this.botUsername = null;
    this.isSupported = this.checkSupport();
  }

  checkSupport() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return false;
    
    // Check if Telegram Web App API is available
    if (window.Telegram && window.Telegram.WebApp) {
      return true;
    }

    // Check if we can open external links
    return true;
  }

  // Open Telegram chat with user
  openUserChat(userId) {
    if (!userId) {
      console.warn('Telegram user ID is required');
      return false;
    }

    const telegramUrl = generateTelegramLink(userId);
    
    try {
      // Try to open in current window for mobile
      if (this.isMobile()) {
        window.location.href = telegramUrl;
      } else {
        // Open in new window for desktop
        const newWindow = window.open(telegramUrl, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          // Fallback if popup was blocked
          window.location.href = telegramUrl;
        }
      }
      return true;
    } catch (error) {
      console.error('Error opening Telegram chat:', error);
      return false;
    }
  }

  // Open Telegram bot
  openBot(botUsername) {
    if (!botUsername) {
      console.warn('Bot username is required');
      return false;
    }

    const botUrl = `https://t.me/${botUsername}`;
    
    try {
      if (this.isMobile()) {
        window.location.href = botUrl;
      } else {
        const newWindow = window.open(botUrl, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          window.location.href = botUrl;
        }
      }
      return true;
    } catch (error) {
      console.error('Error opening Telegram bot:', error);
      return false;
    }
  }

  // Send message to Telegram user (if bot API is available)
  async sendMessage(userId, message) {
    // This would require bot token and should be done from backend
    console.warn('sendMessage should be called from backend with bot token');
    return false;
  }

  // Share content via Telegram
  shareContent(text, url) {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url || window.location.href)}&text=${encodeURIComponent(text)}`;
    
    try {
      if (this.isMobile()) {
        window.location.href = shareUrl;
      } else {
        const newWindow = window.open(shareUrl, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          window.location.href = shareUrl;
        }
      }
      return true;
    } catch (error) {
      console.error('Error sharing via Telegram:', error);
      return false;
    }
  }

  // Join Telegram channel/group
  joinChannel(channelUsername) {
    if (!channelUsername) {
      console.warn('Channel username is required');
      return false;
    }

    const channelUrl = `https://t.me/${channelUsername}`;
    
    try {
      if (this.isMobile()) {
        window.location.href = channelUrl;
      } else {
        const newWindow = window.open(channelUrl, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          window.location.href = channelUrl;
        }
      }
      return true;
    } catch (error) {
      console.error('Error joining Telegram channel:', error);
      return false;
    }
  }

  // Check if running on mobile device
  isMobile() {
    if (typeof window === 'undefined') return false;
    
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  // Get Telegram Web App data (if available)
  getWebAppData() {
    if (typeof window === 'undefined' || !window.Telegram || !window.Telegram.WebApp) {
      return null;
    }

    const webApp = window.Telegram.WebApp;
    
    return {
      initData: webApp.initData,
      initDataUnsafe: webApp.initDataUnsafe,
      version: webApp.version,
      platform: webApp.platform,
      colorScheme: webApp.colorScheme,
      themeParams: webApp.themeParams,
      isExpanded: webApp.isExpanded,
      viewportHeight: webApp.viewportHeight,
      viewportStableHeight: webApp.viewportStableHeight,
      headerColor: webApp.headerColor,
      backgroundColor: webApp.backgroundColor,
      isClosingConfirmationEnabled: webApp.isClosingConfirmationEnabled,
      isVerticalSwipesEnabled: webApp.isVerticalSwipesEnabled
    };
  }

  // Initialize Telegram Web App (if available)
  initWebApp() {
    if (typeof window === 'undefined' || !window.Telegram || !window.Telegram.WebApp) {
      return false;
    }

    const webApp = window.Telegram.WebApp;
    
    // Expand the web app to full height
    webApp.expand();
    
    // Set header color to match app theme
    webApp.setHeaderColor('#3b82f6');
    
    // Enable closing confirmation
    webApp.enableClosingConfirmation();
    
    // Setup main button if needed
    webApp.MainButton.setText('Bosh sahifa');
    webApp.MainButton.onClick(() => {
      // Navigate to main page
      window.location.href = '/';
    });
    
    // Setup back button
    webApp.BackButton.onClick(() => {
      window.history.back();
    });

    return true;
  }

  // Validate Telegram username
  isValidUsername(username) {
    if (!username) return false;
    
    // Telegram username rules:
    // - 5-32 characters
    // - Can contain a-z, 0-9 and underscores
    // - Must start with a letter
    // - Must not end with underscore
    // - Must not have consecutive underscores
    
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,30}[a-zA-Z0-9]$/;
    
    return usernameRegex.test(username) && !username.includes('__');
  }

  // Format Telegram link
  formatTelegramLink(identifier, type = 'user') {
    if (!identifier) return null;
    
    switch (type) {
      case 'user':
        return generateTelegramLink(identifier);
      case 'bot':
      case 'channel':
      case 'group':
        return `https://t.me/${identifier}`;
      default:
        return `https://t.me/${identifier}`;
    }
  }

  // Generate deep link for specific actions
  generateDeepLink(action, params = {}) {
    const baseUrl = 'https://t.me/';
    
    switch (action) {
      case 'share':
        const { url, text } = params;
        return `${baseUrl}share/url?url=${encodeURIComponent(url || '')}&text=${encodeURIComponent(text || '')}`;
      
      case 'bot_start':
        const { botUsername, startParam } = params;
        return `${baseUrl}${botUsername}?start=${encodeURIComponent(startParam || '')}`;
      
      case 'join_chat':
        const { chatUsername } = params;
        return `${baseUrl}${chatUsername}`;
      
      case 'user_chat':
        const { userId } = params;
        return generateTelegramLink(userId);
      
      default:
        return baseUrl;
    }
  }

  // Check if current environment is Telegram Web App
  isWebApp() {
    return typeof window !== 'undefined' && 
           window.Telegram && 
           window.Telegram.WebApp && 
           window.Telegram.WebApp.initData;
  }

  // Get user info from Telegram Web App
  getWebAppUser() {
    if (!this.isWebApp()) return null;
    
    const webApp = window.Telegram.WebApp;
    return webApp.initDataUnsafe.user || null;
  }
}

export default new TelegramService();