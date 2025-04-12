import { NextResponse } from 'next/server';
import ApplicationModel from '@/model/Application'; 

export async function PATCH(request, { params }) {
    const {appId } = await params;
    
    if (!appId) {
        return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    try {
        const payload  = await request.json();
        // console.log(employerNotes, status);
        // console.log(payload);
        
        
        if (!payload) {
            return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
        }

        const updatedApplication = await ApplicationModel.findByIdAndUpdate(appId, payload, { new: true });
        // console.log(updatedApplication);
        
        if (!updatedApplication) {
            return NextResponse.json({ error: 'Application not found or update failed' }, { status: 404 });
        }

        return NextResponse.json(updatedApplication, { status: 200 });
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}