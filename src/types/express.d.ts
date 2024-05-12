import { User as UserEntity } from "@/entities/user";

declare global {
  namespace Express {
    interface Request {
      flash?: any;
      validatedData?: any;
    }

    interface User extends UserEntity {}
  }
}
