import { Injectable, inject, signal,  computed } from "@angular/core";
import { Router } from "@angular/router";
import { SupabaseService } from "./supabase";
import { User } from "../models/models";

@Injectable({providedIn: 'root'})
export class AuthService {
    private router = inject(Router);
    private supabase = inject(SupabaseService);
    
    user = signal<User | null>(null);
    isAuthenticated = computed(() => this.user() !== null);
    userEmail = computed(() => this.user()?.email ?? 'Invitado');
    username = computed(() => this.user()?.username);
    sessionReady = this.checkSession();

    constructor(){
        this.sessionReady = this.checkSession();
    }

    async checkSession(){
        const client = this.supabase.getClient();
        const {data: { session }} = await client.auth.getSession();

        if (session?.user){
            const { data } = await client
                .from('users')
                .select('username')
                .eq('id', session.user.id)
                .single();
            this.user.set({
                id: session.user.id,
                email: session.user.email ?? '',
                username: data?.username ?? 'Invitado'
            });
        }
    }

    async login(email: string, password: string): Promise<{success: boolean, error?: string}> {
        const client = this.supabase.getClient();
        const {data, error} = await client.auth.signInWithPassword({email, password});
        
        if (error) return {success: false, error: error.code};

        if (data.user) {
            const { data: userData } = await client
                .from('users')
                .select('username')
                .eq('id', data.user.id)
                .single();
            this.user.set({id: data.user.id, email: data.user.email ?? '', username: userData?.username ?? 'Invitado'});
            this.router.navigate(['/']);
            return {success: true};
        } else return {success: false, error: 'error'};
    }

    async signup(email: string, password: string, username: string, lastname: string, age: number): Promise<{success: boolean, error?: string}> {
        const client = this.supabase.getClient();
        const {data, error} = await client.auth.signUp({email, password});

        if (error) return {success: false, error: error.code};
        if (!data.user) return {success: false, error: 'error'};

        const { error: dbError } = await client
            .from('users')
            .insert({
                id: data.user.id,
                email,
                username,
                lastname,
                age
            });
        
        if (dbError) return {success: false, error: dbError.code};
        
        this.user.set({
            id: data.user.id,
            email: data.user.email ?? '',
            username
        });
        
        this.router.navigate(['/']);
        return {success: true};
    }

    async logout(): Promise<void> {
        await this.supabase
            .getClient()
            .auth
            .signOut();
        this.user.set(null);
        this.router.navigate(['/']);
    }
}