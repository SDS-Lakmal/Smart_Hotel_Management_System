"use client";
import React from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h1 className="mb-4 text-2xl font-bold text-red-600">Something went wrong</h1>
                <p className="mb-4 text-gray-700">{error?.message || 'An unexpected error occurred.'}</p>
                <button
                    onClick={reset}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
