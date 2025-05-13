import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  BookOpen,
  CheckCircle,
  Zap,
  Factory,
  Gauge,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer } from "@/components/layout/Footer";

export default function LearnMore() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
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
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Log in
          </Button>
          <Button onClick={() => navigate("/register")}>Sign up</Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-indigo-50 to-white pb-12 pt-12 md:pb-24 md:pt-24">
          <div className="container px-4 md:px-6">
            <Button
              variant="ghost"
              size="sm"
              className="mb-8"
              onClick={handleBackClick}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-indigo-100 p-3">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <h1 className="mt-6 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Learn More About MIC Service Laser
              </h1>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Discover how our smart denim manufacturing platform is
                revolutionizing the industry with cutting-edge technology and
                real-time analytics.
              </p>
            </div>
          </div>
        </section>

        {/* Tab Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold">
                      Smart Manufacturing for the Denim Industry
                    </h2>
                    <p className="text-muted-foreground">
                      MIC Service Laser is a comprehensive platform designed
                      specifically for denim manufacturers. Our solution
                      integrates seamlessly with your existing equipment to
                      provide real-time monitoring, predictive maintenance, and
                      advanced analytics.
                    </p>
                    <p className="text-muted-foreground">
                      By leveraging cutting-edge technology, we help you
                      optimize your production processes, reduce downtime, and
                      increase efficiency across your entire manufacturing
                      operation.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span>
                          Industry-specific solutions for denim manufacturing
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span>
                          Real-time monitoring of all production equipment
                        </span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span>AI-powered predictive maintenance</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span>Role-based access for all team members</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl bg-muted p-6">
                    <h3 className="mb-4 text-xl font-bold">
                      Why Choose MIC Service Laser?
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mr-4 rounded-full bg-primary/10 p-2">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Increased Efficiency</h4>
                          <p className="text-sm text-muted-foreground">
                            On average, our clients see a 28% increase in
                            machine efficiency after implementation.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-4 rounded-full bg-primary/10 p-2">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Reduced Downtime</h4>
                          <p className="text-sm text-muted-foreground">
                            Predictive maintenance reduces unexpected downtime
                            by up to 45%.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-4 rounded-full bg-primary/10 p-2">
                          <Gauge className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Quality Improvement</h4>
                          <p className="text-sm text-muted-foreground">
                            Better monitoring leads to a 15% reduction in
                            quality issues.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="features" className="pt-6">
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <Zap className="h-12 w-12 text-indigo-600" />
                      <CardTitle className="mt-2">
                        Real-time Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Monitor all aspects of your production in real-time with
                        customizable dashboards that provide instant insights.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Shield className="h-12 w-12 text-indigo-600" />
                      <CardTitle className="mt-2">
                        Predictive Maintenance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Our AI algorithms predict potential equipment failures
                        before they happen, allowing for scheduled maintenance.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Factory className="h-12 w-12 text-indigo-600" />
                      <CardTitle className="mt-2">Machine Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Track performance metrics, maintenance history, and
                        operational status for each machine in your factory.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Gauge className="h-12 w-12 text-indigo-600" />
                      <CardTitle className="mt-2">Quality Control</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Monitor quality metrics throughout the production
                        process to identify and address issues early.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <svg
                        className="h-12 w-12 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <CardTitle className="mt-2">Reporting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Generate detailed reports for performance, maintenance,
                        and quality metrics in PDF or Excel formats.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <svg
                        className="h-12 w-12 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <CardTitle className="mt-2">Role-Based Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Different access levels for users, technicians, and
                        administrators ensure everyone has the right
                        information.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="technology" className="pt-6">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold">Our Technology Stack</h2>
                    <p className="mt-2 text-muted-foreground">
                      MIC Service Laser is built on a modern, scalable
                      technology stack designed for reliability and performance.
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Frontend Technologies</CardTitle>
                        <CardDescription>
                          The user interface is built with modern web
                          technologies for a responsive experience.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            <span>
                              React for component-based UI development
                            </span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            <span>
                              TypeScript for type safety and improved developer
                              experience
                            </span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            <span>TailwindCSS for responsive styling</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            <span>
                              Qlik Sense for interactive dashboard integration
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Backend Technologies</CardTitle>
                        <CardDescription>
                          Our server infrastructure is built for reliability,
                          security, and performance.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            <span>Node.js and Express for API development</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            <span>MongoDB for flexible data storage</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            <span>
                              TensorFlow for machine learning and predictive
                              analytics
                            </span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                            <span>WebSockets for real-time data updates</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>IoT Integration</CardTitle>
                      <CardDescription>
                        Our platform integrates seamlessly with your
                        manufacturing equipment.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-muted-foreground">
                        The MIC Service Laser platform uses industrial IoT
                        sensors and controllers to gather data from your
                        manufacturing equipment. We support a wide range of
                        protocols and can integrate with most modern
                        manufacturing equipment.
                      </p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium">Sensor Integration</h4>
                          <p className="text-sm text-muted-foreground">
                            Temperature, vibration, power consumption, and other
                            critical sensors feed data directly into our
                            platform.
                          </p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <h4 className="font-medium">Protocol Support</h4>
                          <p className="text-sm text-muted-foreground">
                            We support MQTT, OPC-UA, Modbus, and other
                            industrial protocols for seamless integration.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="benefits" className="pt-6">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold">
                      Benefits for Your Business
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      MIC Service Laser delivers tangible benefits across your
                      entire manufacturing operation.
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Increased Productivity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          By minimizing downtime and optimizing machine
                          performance, our clients typically see a 15-25%
                          increase in overall productivity.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <p className="text-lg font-bold text-green-600">
                          +20% Average Productivity Gain
                        </p>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Cost Reduction</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Predictive maintenance reduces repair costs and
                          extends machine lifespans, while efficiency
                          improvements reduce waste and energy consumption.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <p className="text-lg font-bold text-green-600">
                          -18% Maintenance Costs
                        </p>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Quality Improvement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Real-time monitoring and alerts help identify quality
                          issues before they become significant problems,
                          reducing defects and rework.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <p className="text-lg font-bold text-green-600">
                          +15% Quality Improvement
                        </p>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Data-Driven Decisions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Comprehensive analytics and reporting give you the
                          insights needed to make informed decisions about your
                          manufacturing processes.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Improved Staff Efficiency</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Role-based access ensures each team member has the
                          tools and information they need to perform their job
                          effectively.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Competitive Advantage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Stay ahead of the competition with cutting-edge
                          technology that helps you produce higher quality
                          products more efficiently.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-indigo-600 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to transform your denim manufacturing?
                </h2>
                <p className="mx-auto max-w-[900px] md:text-xl/relaxed">
                  Join the leading denim manufacturers who are already
                  optimizing their production with our platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  onClick={() => navigate("/register")}
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-indigo-50"
                >
                  Get Started
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
