
import { NextResponse } from 'next/server';
import { getUserIdFromToken, saveTicket, getTickets, deleteTicket } from '@/app/actions/tickets';

async function handle(req: Request, { params }: { params: { action: string } }) {
    const { action } = params;
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];

    try {
        const userId = await getUserIdFromToken(idToken);
        const body = await req.json().catch(() => ({}));

        switch (action) {
            case 'saveTicket':
                const { ticketData } = body;
                if (!ticketData) {
                    return NextResponse.json({ error: 'Bad Request: ticketData is required' }, { status: 400 });
                }
                const saveResult = await saveTicket(ticketData, userId);
                return NextResponse.json(saveResult);

            case 'getTickets':
                const tickets = await getTickets(userId);
                return NextResponse.json({ tickets });
            
            case 'deleteTicket':
                const { ticketId } = body;
                if (!ticketId) {
                    return NextResponse.json({ error: 'Bad Request: ticketId is required' }, { status: 400 });
                }
                const deleteResult = await deleteTicket(ticketId, userId);
                return NextResponse.json(deleteResult);

            default:
                return NextResponse.json({ error: 'Action not found' }, { status: 404 });
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'An internal server error occurred' }, { status: 500 });
    }
}

export { handle as POST };
