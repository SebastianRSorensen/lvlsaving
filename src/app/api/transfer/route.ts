

export const POST = async (req: NextRequest) => {

    const body = await req.body.json();

    const { getUser } = getKindeServerSession()
    const user = getUser()

    const { id: userId } = user

    if (!usertId) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { goalId, amount } = transferValidator.parse(body)

    const goal = await db.savingGoal.findUnique({
        where: {
            id: goalId
        }
    })


}