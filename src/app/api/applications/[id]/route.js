import { NextResponse } from 'next/server';
import ApplicationModel from '@/model/Application'; 

export async function PATCH(request, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    try {
        const body = await request.json();

        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
        }

        const updatedApplication = await ApplicationModel.findByIdAndUpdate(id, body, { new: true });

        if (!updatedApplication) {
            return NextResponse.json({ error: 'Application not found or update failed' }, { status: 404 });
        }

        return NextResponse.json(updatedApplication, { status: 200 });
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}