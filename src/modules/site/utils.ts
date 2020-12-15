export async function awaiter<T>(fn: () => T, delay: number): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => {
      fn();
      resolve();
    }, delay);
  });
}

export enum ShareProvider {
  WHATSAPP = "whatsapp"
}

enum MobileOS {
  IOS = "iOS",
  ANDROID = "android",
  COMPUTER = "computer"
}

type ProviderLinks = {
  [MobileOS.IOS]: string;
  [MobileOS.ANDROID]: string;
  [MobileOS.COMPUTER]: string;
};

const linkBuilderByProvider: (
  message: string
) => { [key: string]: ProviderLinks } = (message: string) => ({
  [ShareProvider.WHATSAPP]: {
    [MobileOS.IOS]: `whatsapp://send?text=${encodeURIComponent(message)}`,
    [MobileOS.ANDROID]: `intent://send?text=${encodeURIComponent(
      message
    )}&text=#Intent;package=com.whatsapp;scheme=whatsapp;end&text=${message}`,
    [MobileOS.COMPUTER]: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`
  }
});

function buildLinks(provider: ShareProvider, message: string) {
  return linkBuilderByProvider(message)[ShareProvider.WHATSAPP];
}

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 */
function getMobileOperatingSystem(): MobileOS {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
    return MobileOS.ANDROID;
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return MobileOS.IOS;
  }

  return MobileOS.COMPUTER;
}

export function buildGameRoomLink(roomId: string): string {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseURL = `${protocol}://${location.host}`;
  return `${baseURL}/${roomId}/join`;
}

function openNewWindow(url: string) {
  const win = window.open(url, "_blank");
  if (!win) return;
  win.focus();
}

export function shareJoinGameRoomLink(roomId: string, provider: ShareProvider) {
  const mobileOS = getMobileOperatingSystem();
  const providerLinks: ProviderLinks = buildLinks(
    provider,
    buildGameRoomLink(roomId)
  );
  openNewWindow(providerLinks[mobileOS]);
}
