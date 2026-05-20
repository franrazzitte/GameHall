import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth";

export const clientGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    await auth.sessionReady;
    if (!auth.isAuthenticated()) return true;
    router.navigate(['/']);
    return false;
}