import * as z from 'zod'
import { Models } from 'appwrite'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { useToast } from '@/components/ui/use-toast'
import { useUserContext } from '@/context/authContext'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'

import { Button } from '../ui/button'
import Loader from '../shared/Loader'
import { CommentValidation } from '@/validation'
import { Textarea } from '../ui/textarea'

import { useSaveComment } from '@/lib/react-query/queriesAndMutations'

type PostFormProps = {
	postId: string
}

const PostForm = ({ postId }: PostFormProps) => {
	const navigate = useNavigate()
	const { toast } = useToast()
	const { user } = useUserContext()
	const form = useForm<z.infer<typeof CommentValidation>>({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			comment: '',
		},
	})

	// Query
	const { mutateAsync: saveComment, isPending } = useSaveComment()
	// const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
	// 	useUpdatePost()

	// Handler
	const handleSubmit = async (value: z.infer<typeof CommentValidation>) => {
		const newComment = await saveComment({
			author: user.id,
			post: postId,
			comment: value.comment,
		})
		if (!newComment) {
			toast({
				title: `post comment failed. Please try again.`,
			})
		}
		navigate('/')
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="flex flex-col gap-9 w-full  max-w-5xl"
			>
				<FormField
					control={form.control}
					name="comment"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">
								Commentaire
							</FormLabel>
							<FormControl>
								<Textarea
									className="shad-textarea custom-scrollbar"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>

				<div className="flex gap-4 items-center justify-end">
					<Button
						type="button"
						className="shad-button_dark_4"
						onClick={() => navigate(-1)}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						className="shad-button_primary whitespace-nowrap"
						// disabled={isLoadingCreate || isLoadingUpdate}
					>
						{/* {(isLoadingCreate || isLoadingUpdate) && <Loader />} */}
						Post
					</Button>
				</div>
			</form>
		</Form>
	)
}

export default PostForm
