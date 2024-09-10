import Layout from "@/components/EmployeeLayout";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Layout>
            {children}
        </Layout>
    );
}
