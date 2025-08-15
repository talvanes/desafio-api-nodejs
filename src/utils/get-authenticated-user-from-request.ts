import type {FastifyRequest} from 'fastify'

export default function getAuthenticatedUserFromRequest(request: FastifyRequest) {
    const user = request.user

    if (!user) {
        throw new Error('Invalid authentication')
    }

    return user
}