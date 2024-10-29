import { RoutingKeys } from '../enums/commons.enum';

export interface IMessageBroker {
  produce(payload: any, routing_key: RoutingKeys): Promise<boolean>;

  consume(): void;
}
