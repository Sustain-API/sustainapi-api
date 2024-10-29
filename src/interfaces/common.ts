export interface IPaginatedRes<T = any> {
  data: T[];
  pagination: {
    total: number;
    perPage: number;
    pageSize: number;
    pageNumber: number;
  };
}

export interface IOneEmail {
  email: string;
  subjectOrTemplateId: string;
  htmlOrTemplate?: any;
  options?: any;
  attachments?: any[];
}

export interface IPushNotification {
  include_player_ids: string[];

  // The contents on this interface will be used to customize
  // messages for each Push notification that is being sent
  contents: object;
  data?: object;
  app_url?: string;
}

export interface SubscriptionResponse {
  paymentLink: string;
}
