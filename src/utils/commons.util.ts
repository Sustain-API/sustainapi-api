import { IPaginatedRes } from "../interfaces/common";
import * as JWT from "jsonwebtoken";

export default class CommonUtil {
  public static paginate = (
    data: any[],
    total: number,
    perPage: number,
    pageNumber: number
  ): IPaginatedRes => {
    return {
      data,
      pagination: {
        total,
        perPage,
        pageNumber,
        pageSize: data.length,
      },
    };
  };

  static verifyToken = async (
    token: string,
    secretKey: string
  ): Promise<any> => {
    try {
      return JWT.verify(token, secretKey);
    } catch (error) {
      console.log("error ", error);
      throw error;
    }
  };

  static generateToken = async (
    data: Record<string, any>,
    expiresIn: string,
    secretKey: string
  ): Promise<string> => {
    const key = secretKey;
    const expire = expiresIn;
    return JWT.sign(data, key, { expiresIn: expire });
  };
}
