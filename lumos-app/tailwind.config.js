/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neutral: {
                    l5: '#f8fafc', // slate-50
                    l4: '#f1f5f9', // slate-100
                    l3: '#e2e8f0', // slate-200
                    l2: '#cbd5e1', // slate-300
                    l1: '#94a3b8', // slate-400
                    DEFAULT: '#64748b', // slate-500
                    d1: '#475569', // slate-600
                    d2: '#334155', // slate-700
                    d3: '#1e293b', // slate-800
                },
                primary: {
                    l3: '#bfdbfe',
                    l2: '#93c5fd',
                    DEFAULT: '#3b82f6', // blue-500
                    d1: '#2563eb',
                    d2: '#1d4ed8',
                },
                information: {
                    l3: '#e0f2fe',
                    l2: '#bae6fd',
                    l1: '#7dd3fc',
                    DEFAULT: '#0ea5e9', // sky-500
                    d1: '#0284c7',
                    d2: '#0369a1',
                },
                success: {
                    l3: '#dcfce7',
                    l2: '#bbf7d0',
                    DEFAULT: '#22c55e', // green-500
                    d2: '#15803d',
                },
                warning: {
                    l5: '#fefce8',
                    l3: '#fef08a',
                    l2: '#fde047',
                    DEFAULT: '#eab308', // yellow-500
                    d2: '#a16207',
                },
                danger: {
                    l3: '#fee2e2',
                    l2: '#fecaca',
                    l1: '#fca5a5',
                    DEFAULT: '#ef4444', // red-500
                    d2: '#b91c1c',
                },
                secondary: {
                    DEFAULT: '#6366f1', // indigo-500
                    l2: '#a5b4fc',
                },
                orange: {
                    l3: '#ffedd5',
                    l2: '#fed7aa',
                    l1: '#fdba74',
                    DEFAULT: '#f97316', // orange-500
                    d1: '#ea580c',
                    d2: '#c2410c',
                },
                alternativePrimary: {
                    l4: '#e0e7ff',
                    l1: '#818cf8',
                    DEFAULT: '#4f46e5',
                    d2: '#3730a3'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
