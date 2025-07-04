# Security Configuration Guide

## JWT Security
- ACCESS_TOKEN_SECRET=your-super-secure-access-token-secret-here-min-32-chars
- ACCESS_TOKEN_EXPIRY=15m
- REFRESH_TOKEN_SECRET=your-super-secure-refresh-token-secret-here-min-32-chars-different-from-access
- REFRESH_TOKEN_EXPIRY=7d

## Session Security
- SESSION_CLEANUP_INTERVAL=86400000  # 24 hours in milliseconds
- MAX_SESSIONS_PER_USER=5            # Maximum concurrent sessions per user
- SESSION_INACTIVITY_TIMEOUT=604800000  # 7 days in milliseconds

## Rate Limiting
- GENERAL_RATE_LIMIT=100             # Requests per 15 minutes
- AUTH_RATE_LIMIT=5                  # Auth attempts per 15 minutes
- SESSION_RATE_LIMIT=10              # Session operations per 5 minutes

## Security Headers
- TRUST_PROXY=true                   # Enable if behind proxy/load balancer
- SECURE_COOKIES=true                # Use secure cookies in production
- CORS_ORIGIN=http://localhost:5173,https://yourdomain.com

## Password Security
- MIN_PASSWORD_LENGTH=8
- REQUIRE_PASSWORD_COMPLEXITY=true
- PASSWORD_SALT_ROUNDS=12

## IP Security
- ENABLE_IP_WHITELIST=false
- IP_WHITELIST=127.0.0.1,::1
- BLOCK_SUSPICIOUS_IPS=true

## Monitoring
- LOG_FAILED_ATTEMPTS=true
- LOG_SESSION_CHANGES=true
- ALERT_ON_MULTIPLE_FAILURES=true
