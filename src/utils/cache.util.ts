export default class CacheUtil {
  private static service = 'ibloovelement';

  static ONE_HOUR = 60 * 60 * 1000;
  static ONE_DAY = 60 * 60 * 24 * 1000;
  static TEN_MINUTES = 60 * 10 * 1000;
  static THIRTY_MINUTES = 60 * 30 * 1000;
  static FIVE_MINUTES = 60 * 5 * 1000;

  public static getCacheKey(key: string): string {
    console.log('cache-key %s', key);
    return `${process.env.APP_ENV || 'unknown'}_${
      CacheUtil.service
    }_${key?.trim()}`;
  }

  static getRegularUserProfileKey(userId: string) {
    return `user_${userId}_regular_profile`;
  }

  static getEventVendorRecommendationKey(eventId: string) {
    return `event_${eventId}_vendor_recommendation`;
  }

  static getEventAnalyticsKey(eventId: string) {
    return `event_${eventId}_organizer_analytics`;
  }
}
