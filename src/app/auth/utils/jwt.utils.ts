export type JwtPayload = {
    sub?: string;
    email?: string;
    name?: string;
    exp?: number;
    iat?: number;
    [key: string]: unknown;
  };
  
  function base64UrlDecode(input: string): string {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    return decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  }
  
  export function decodeJwt(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
  
      const json = base64UrlDecode(parts[1]);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
  