<script lang="ts">
	import { createAuthClient } from 'better-auth/svelte';

	// Ensure the client is initialized correctly
	const authClient = createAuthClient();

	const handleSignIn = async () => {
		console.log('Sign-in button clicked...');
		try {
			await authClient.signIn.social({
				provider: 'google',
				callbackURL: '/admin/inquiries'
			});
		} catch (error) {
			console.error('Auth error details:', error);
			alert('Login failed to start. Check console.');
		}
	};
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-6 text-center">
	<div class="w-full max-w-md border border-white/10 bg-white/[0.02] p-12">
		<h1 class="mb-8 font-serif text-3xl text-[#C5A059] uppercase italic">Admin Access</h1>

		<button
			type="button"
			onclick={handleSignIn}
			class="flex w-full items-center justify-center gap-4 bg-[#C5A059] py-4 font-bold text-black shadow-lg transition-all hover:bg-white active:scale-95"
		>
			<img src="https://www.google.com/favicon.ico" alt="" class="h-4 w-4" />
			Continue with Google
		</button>
	</div>
</div>
