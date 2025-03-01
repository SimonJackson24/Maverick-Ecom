interface CookieOptions {
  expires?: Date | number | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export class CookieService {
  static set(name: string, value: string, options: CookieOptions = {}): void {
    const {
      expires,
      path = '/',
      domain,
      secure = true,
      sameSite = 'Strict'
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires) {
      if (typeof expires === 'number') {
        const d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        cookieString += `; expires=${d.toUTCString()}`;
      } else if (expires instanceof Date) {
        cookieString += `; expires=${expires.toUTCString()}`;
      } else {
        cookieString += `; expires=${expires}`;
      }
    }

    if (path) cookieString += `; path=${path}`;
    if (domain) cookieString += `; domain=${domain}`;
    if (secure) cookieString += '; secure';
    if (sameSite) cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
  }

  static get(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }

  static delete(name: string, path = '/', domain?: string): void {
    // Set expiration to past date to delete the cookie
    this.set(name, '', {
      expires: new Date(0),
      path,
      domain,
      secure: true,
      sameSite: 'Strict'
    });
  }

  static deleteAll(path = '/'): void {
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      const name = cookie.split('=')[0].trim();
      this.delete(name, path);
    }
  }

  static deleteByPattern(pattern: RegExp, path = '/'): void {
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      const name = cookie.split('=')[0].trim();
      if (pattern.test(name)) {
        this.delete(name, path);
      }
    }
  }

  static exists(name: string): boolean {
    return this.get(name) !== null;
  }

  static getAll(): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    const cookiesList = document.cookie.split(';');

    for (let cookie of cookiesList) {
      const [name, value] = cookie.split('=').map(part => part.trim());
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }

    return cookies;
  }
}
