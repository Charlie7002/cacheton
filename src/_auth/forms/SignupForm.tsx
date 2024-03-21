import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'
import { SignupValidation } from '@/validation'
import Loader from '@/components/shared/Loader'
import { Link } from 'react-router-dom'
import { createUserAccount } from '@/lib/appwrite/api'

const SignupForm = () => {
	const form = useForm<z.infer<typeof SignupValidation>>({
		resolver: zodResolver(SignupValidation),
		defaultValues: {
			name: '',
			username: '',
			email: '',
			password: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof SignupValidation>) => {
		const newUser = await createUserAccount(values)
		console.log(newUser)
	}

	const isLoading = false

	return (
		<Form {...form}>
			<div className="sm:w-420 flex-center flex-col">
				<img src="/assets/images/logo.svg" alt="logo" />
				<h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
					Créer un nouveau compte
				</h2>
				<p className="text-light-3 small-medium md:base-regular mt-2">
					Pour utiliser ce truc renseigner les champs.
				</p>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-5 w-full mt-4"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">Nom</FormLabel>
								<FormControl>
									<Input
										type="text"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">
									Pseudo
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">Email</FormLabel>
								<FormControl>
									<Input
										type="text"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">
									Mot de passe
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										className="shad-input"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="shad-button_primary">
						{isLoading ? (
							<div className="flex-center gap-2">
								<Loader />
								Chargement ...
							</div>
						) : (
							'Valider'
						)}
					</Button>

					<p className="text-small-regular text-light-2 text-center mt-2">
						Déjà un compte ?
						<Link
							to="/sign-in"
							className="text-primary-500 text-small-semibold ml-1"
						>
							Se connecter
						</Link>
					</p>
				</form>
			</div>
		</Form>
	)
}

export default SignupForm