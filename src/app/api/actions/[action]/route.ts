import {NextRequest, NextResponse} from 'next/server';
import * as actions from '@/app/actions/tickets';

type ActionName = keyof typeof actions;

export async function POST(
  req: NextRequest,
  {params}: {params: {action: string}}
) {
  const actionName = params.action as ActionName;
  const action = actions[actionName];

  if (!action) {
    return NextResponse.json({error: 'Action not found'}, {status: 404});
  }

  try {
    const body = await req.json().catch(() => null);
    // @ts-ignore
    const result = body ? await action(body) : await action();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {error: error.message || 'An error occurred'},
      {status: 500}
    );
  }
}
