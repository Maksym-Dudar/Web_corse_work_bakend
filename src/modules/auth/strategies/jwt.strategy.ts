import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from "express";
import { AccessTokenPayload } from "../types.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        const cookies = req.cookies as unknown as
          | Record<string, string>
          | undefined;

        return cookies?.access_token ?? null;
      },
      secretOrKey: process.env.JWT_SECRET || "AudiRs7",
    });
  }

  validate(payload: AccessTokenPayload) {
    return payload;
  }
}
