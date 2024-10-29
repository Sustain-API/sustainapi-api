export enum RoutingKeys {
  NOTIFICATION_SERVICE = "service.notification",
}

export enum GENERIC_RESPONSE_STATUS {
  SUCCESS = "200",       // Standard HTTP Success
  CREATED = "201",       // Created (for successful resource creation)
  BAD_REQUEST = "400",   // Client error: Invalid request data
  UNAUTHORIZED = "401",  // Client error: Unauthorized access
  FORBIDDEN = "403",     // Client error: Forbidden action
  NOT_FOUND = "404",     // Resource not found
  INTERNAL_ERROR = "500", // Server error
  FAILED = "99",         // General failure (non-specific)
  PENDING = "03",        // Pending status for ongoing processes
}

export enum PAYMENT_STATUS {
  SUCCESS = "00",          // Payment completed successfully
  FAILED = "99",           // General payment failure
  PENDING = "03",          // Payment is pending
  NOT_FOUND = "04",        // Payment information not found
  REVERSED = "91",         // Payment reversed
  ERROR = "95",            // Specific error in payment processing
  UNKNOWN = "96",          // Unknown payment status
}

export enum ADMIN_ROLES {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
}
