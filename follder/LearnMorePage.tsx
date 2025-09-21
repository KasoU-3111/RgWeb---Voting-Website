// src/pages/LearnMorePage.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Database, Layers, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const TechCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    </div>
);

const LearnMorePage = () => {
    return (
        <div className="min-h-screen bg-muted/40">
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Project Overview</h1>
                    <Button asChild variant="outline">
                        <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Link>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    <section className="text-center animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
                        <h2 className="text-4xl font-extrabold text-primary mb-4">VoteSecure</h2>
                        <p className="text-xl text-muted-foreground">
                            A modern, secure, and transparent digital voting platform designed to bring democracy into the future.
                        </p>
                    </section>

                    <Card className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-200">
                        <CardHeader>
                            <CardTitle>Motive & Vision</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Traditional voting systems face challenges of accessibility, transparency, and security. VoteSecure was conceived to address these issues by leveraging modern web technologies. Our vision is to create a platform where every vote is verifiably secure, every result is transparently auditable, and every eligible citizen can participate with ease and confidence. We aim to build public trust in digital systems and demonstrate that technology can strengthen, rather than compromise, the democratic process.
                            </p>
                        </CardContent>
                    </Card>

                    <section className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-300">
                        <h2 className="text-3xl font-bold text-center mb-8">Technical Architecture</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <TechCard 
                                icon={<Layers size={24} />}
                                title="Frontend"
                                description="A dynamic and responsive user interface built with React and TypeScript, using the Vite build tool for lightning-fast development. Components are styled with Tailwind CSS and shadcn/ui for a modern, clean aesthetic."
                            />
                             <TechCard 
                                icon={<Database size={24} />}
                                title="Backend & Database"
                                description="A robust RESTful API powered by Node.js and Express.js. PostgreSQL serves as our relational database, providing a reliable and scalable foundation for storing all user, candidate, and vote data securely."
                            />
                        </div>
                    </section>

                     <section className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500 delay-400">
                        <h2 className="text-3xl font-bold text-center mb-8">Core Security Measures</h2>
                        <div className="space-y-6">
                           <TechCard 
                                icon={<Lock size={24} />}
                                title="Secure Authentication"
                                description="User sessions are managed using JSON Web Tokens (JWT), ensuring that all sensitive actions and data are accessible only to authenticated users. Passwords are never stored in plain text; they are securely hashed using the industry-standard bcrypt algorithm."
                            />
                            <TechCard 
                                icon={<Shield size={24} />}
                                title="Role-Based Access Control (RBAC)"
                                description="The system enforces strict role-based access. Protected API endpoints on the server check a user's JWT to verify their role (e.g., 'admin' or 'voter'), preventing unauthorized access to administrative functions and ensuring voters cannot perform restricted actions."
                            />
                             <TechCard 
                                icon={<Database size={24} />}
                                title="Database Integrity"
                                description="We enforce a 'one person, one vote' policy at the database level using a UNIQUE constraint on the user's ID in the votes table. This provides a fundamental safeguard against duplicate voting. All database queries are parameterized to prevent SQL injection attacks."
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default LearnMorePage;