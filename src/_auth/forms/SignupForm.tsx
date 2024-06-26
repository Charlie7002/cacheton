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
import { Link, useNavigate } from 'react-router-dom'

import { useToast } from '@/components/ui/use-toast'
import {
	useCreateUserAccount,
	useSignInAccount,
} from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/authContext'

const SignupForm = () => {
	const { toast } = useToast()
	const navigate = useNavigate()
	const { checkAuthUser, isLoading } = useUserContext()
	const form = useForm<z.infer<typeof SignupValidation>>({
		resolver: zodResolver(SignupValidation),
		defaultValues: {
			name: '',
			username: '',
			email: '',
			password: '',
		},
	})

	const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
		useCreateUserAccount()

	const { mutateAsync: signInAccount, isPending: isSigningInUser } =
		useSignInAccount()

	const onSubmit = async (values: z.infer<typeof SignupValidation>) => {
		const newUser = await createUserAccount(values)
		if (!newUser) {
			return toast({
				title: 'Une erreur est survenue, veuillez reessayer',
			})
		}
		const session = await signInAccount({
			email: values.email,
			password: values.password,
		})

		if (!session) {
			return toast({
				title: 'Une erreur est survenue, veuillez reessayer',
			})
		}
		const isLoggedIn = await checkAuthUser()
		if (isLoggedIn) {
			form.reset()
			navigate('/')
		} else {
			return toast({ title: 'Une erreur est survenue, veuillez reessayer' })
		}
	}

	return (
		<Form {...form}>
			<div className="sm:w-420 flex-center flex-col">
				<img
					src="/assets/images/fatcat.png"
					alt="logo"
					className="h-16 w-16"
				/>
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
						{isCreatingAccount || isSigningInUser || isLoading ? (
							<div className="flex-center gap-2">
								<Loader /> Loading...
							</div>
						) : (
							"S'inscrire"
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
