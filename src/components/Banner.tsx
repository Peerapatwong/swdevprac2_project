import Link from 'next/link';

export default function Banner() {
    return (
        <section className="relative flex min-h-[clamp(34rem,68vh,46rem)] w-full overflow-hidden bg-[linear-gradient(45deg,#0f172a_0%,#1e293b_42%,#4f6fa3_100%)] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_36%)]" />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-8 py-20 sm:px-12 lg:px-16">
                <div className="max-w-3xl">
                    <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                        Where every interest finds its workshop
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                        Find the one that suits you. Learn from experts and meet people who share your curiosity.
                    </p>
                    <Link
                        href="/workshop"
                        className="mt-8 inline-flex rounded-md bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-blue-700"
                    >
                        Select Workshop
                    </Link>
                </div>
            </div>
        </section>
    );
}
