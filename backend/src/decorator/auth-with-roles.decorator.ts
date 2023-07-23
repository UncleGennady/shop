import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/guards/roles.guards";


export const AuthRole = () =>UseGuards(AuthGuard('jwt'),RolesGuard)