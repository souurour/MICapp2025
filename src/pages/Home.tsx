import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, BarChart3, Zap, Factory, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="rounded bg-indigo-600 p-1">
            <div className="h-6 w-6 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                <path d="M12 12v5" />
                <path d="M8 12v5" />
                <path d="M16 12v5" />
              </svg>
            </div>
          </div>
          <span className="font-bold text-lg">MIC Service Laser</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleLoginClick}>
            Log in
          </Button>
          <Button onClick={handleRegisterClick}>Sign up</Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Smart Denim Manufacturing Platform
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Transforming denim production with real-time monitoring,
                    predictive maintenance, and advanced analytics
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    onClick={handleRegisterClick}
                    size="lg"
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Get Started
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/learn-more")}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-video overflow-hidden rounded-xl border bg-background">
                  {!isVideoPlaying ? (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <img
                        alt="Denim Manufacturing"
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                      />
                    </div>
                  ) : (
                    <iframe
                      className="aspect-video h-full w-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      title="Denim Manufacturing Process"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-indigo-100 px-3 py-1 text-sm text-indigo-800">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need to optimize your denim production
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our comprehensive platform provides real-time insights,
                  predictive maintenance, and powerful analytics to streamline
                  your manufacturing process.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-indigo-600" />
                  <CardTitle className="mt-4">Real-time Analytics</CardTitle>
                  <CardDescription>
                    Monitor production metrics, machine performance, and quality
                    control in real-time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Get instant insights into your production process with
                    customizable dashboards and real-time alerts.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="gap-1">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Zap className="h-10 w-10 text-indigo-600" />
                  <CardTitle className="mt-4">Predictive Maintenance</CardTitle>
                  <CardDescription>
                    Reduce downtime with AI-powered maintenance predictions and
                    alerts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Our machine learning algorithms predict potential issues
                    before they cause production delays.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="gap-1">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Factory className="h-10 w-10 text-indigo-600" />
                  <CardTitle className="mt-4">Machine Management</CardTitle>
                  <CardDescription>
                    Centralized control and monitoring of all manufacturing
                    equipment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Track performance metrics, maintenance history, and
                    operational status for each machine.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="gap-1">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-indigo-600" />
                  <CardTitle className="mt-4">
                    Efficiency Optimization
                  </CardTitle>
                  <CardDescription>
                    Identify bottlenecks and optimize production workflows.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Analyze production data to find opportunities for increasing
                    throughput and reducing waste.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="gap-1">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="w-full bg-slate-50 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Powerful Dashboards at Your Fingertips
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get a sneak peek of our intuitive dashboards that provide
                  valuable insights into your manufacturing process.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <div className="rounded-xl border bg-background shadow-lg">
                <iframe
                  src="https://embed.charts.dev/demo/dashboard1"
                  title="Dashboard Preview"
                  className="aspect-[16/9] w-full rounded-xl"
                  style={{ border: 0 }}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-indigo-600 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to transform your denim manufacturing?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join the leading denim manufacturers who are already
                  optimizing their production with our platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  onClick={handleRegisterClick}
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-indigo-50"
                >
                  Get Started
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
