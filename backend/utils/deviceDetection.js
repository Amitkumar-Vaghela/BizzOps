import useragent from 'useragent';

export const parseUserAgent = (userAgentString) => {
    const agent = useragent.parse(userAgentString);
    
    const browserName = agent.family;
    const browserVersion = agent.toVersion();
    const osName = agent.os.family;
    const osVersion = agent.os.toVersion();
    
    return {
        browser: `${browserName} ${browserVersion}`,
        browserName: browserName,
        browserVersion: browserVersion,
        os: `${osName} ${osVersion}`,
        osName: osName,
        osVersion: osVersion,
        device: agent.device.family || 'Unknown',
        deviceType: getDeviceType(userAgentString),
        architecture: getArchitecture(userAgentString),
        platform: getPlatform(userAgentString)
    };
};

export const getDeviceType = (userAgentString) => {
    const ua = userAgentString.toLowerCase();
    
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
        return 'mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
        return 'tablet';
    } else {
        return 'desktop';
    }
};

export const getArchitecture = (userAgentString) => {
    const ua = userAgentString.toLowerCase();
    
    if (ua.includes('x64') || ua.includes('x86_64') || ua.includes('amd64')) {
        return '64-bit';
    } else if (ua.includes('x86') || ua.includes('i386') || ua.includes('i686')) {
        return '32-bit';
    } else if (ua.includes('arm64') || ua.includes('aarch64')) {
        return 'ARM 64-bit';
    } else if (ua.includes('arm')) {
        return 'ARM';
    }
    
    return 'Unknown';
};

export const getPlatform = (userAgentString) => {
    const ua = userAgentString.toLowerCase();
    
    if (ua.includes('windows')) {
        return 'Windows';
    } else if (ua.includes('macintosh') || ua.includes('mac os')) {
        return 'macOS';
    } else if (ua.includes('linux')) {
        return 'Linux';
    } else if (ua.includes('android')) {
        return 'Android';
    } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
        return 'iOS';
    }
    
    return 'Unknown';
};

export const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
        case 'mobile':
            return '📱';
        case 'tablet':
            return '📱';
        case 'desktop':
            return '💻';
        default:
            return '🖥️';
    }
};

export const getBrowserIcon = (browserName) => {
    const browser = browserName?.toLowerCase() || '';
    
    if (browser.includes('chrome')) return '🌐';
    if (browser.includes('firefox')) return '🦊';
    if (browser.includes('safari')) return '🧭';
    if (browser.includes('edge')) return '🔷';
    if (browser.includes('opera')) return '🎭';
    if (browser.includes('brave')) return '🦁';
    
    return '🌐';
};

export const getOSIcon = (osName) => {
    const os = osName?.toLowerCase() || '';
    
    if (os.includes('windows')) return '🪟';
    if (os.includes('mac')) return '🍎';
    if (os.includes('linux')) return '🐧';
    if (os.includes('android')) return '🤖';
    if (os.includes('ios')) return '📱';
    
    return '💻';
};

export const getClientIP = (req) => {
    // In development, prioritize direct connection
    if (process.env.NODE_ENV === 'development') {
        return req.connection?.remoteAddress || 
               req.socket?.remoteAddress || 
               req.ip || 
               '127.0.0.1';
    }
    
    // In production, you might want to trust certain headers
    // but be careful about spoofing
    return req.ip || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress ||
           (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
           req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           req.headers['x-real-ip'] ||
           'Unknown';
};
