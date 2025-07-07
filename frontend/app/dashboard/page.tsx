"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
} from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  LineChart,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"

// Mock data
const monthlyData = [
  { name: "Jan", expenses: 2400, income: 4000 },
  { name: "Feb", expenses: 1398, income: 3000 },
  { name: "Mar", expenses: 9800, income: 5000 },
  { name: "Apr", expenses: 3908, income: 6000 },
  { name: "May", expenses: 4800, income: 7000 },
  { name: "Jun", expenses: 3800, income: 6000 },
]

const topCategories = [
  { name: "Food & Dining", amount: 1250, percent: 30 },
  { name: "Housing", amount: 950, percent: 25 },
  { name: "Transportation", amount: 570, percent: 15 },
]

const recentTransactions = [
  { id: 1, name: "Grocery Store", category: "Food & Dining", amount: 56.42, date: "2023-06-12", type: "expense" },
  { id: 2, name: "Salary", category: "Income", amount: 3500, date: "2023-06-10", type: "income" },
  { id: 3, name: "Electric Bill", category: "Utilities", amount: 89.99, date: "2023-06-09", type: "expense" },
  { id: 4, name: "Gas Station", category: "Transportation", amount: 45.5, date: "2023-06-07", type: "expense" },
]

export default function DashboardPage() {
  const { resolvedTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const { user, loading } = useAuth({ redirectIfUnauthenticated: true })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null


  return (
    <div className="flex flex-col p-4 md:p-6 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">👋 {user?.username}, Welcome Back!</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Link href="/dashboard/expenses/add">
              <Button size="sm" variant="link" className="gap-1">
                <PlusCircle className="h-4 w-4" /> Add Expense
              </Button>
            </Link>
            <Link href="/dashboard/income/add">
              <Button size="sm" variant="link" className="gap-1">
                <PlusCircle className="h-4 w-4" /> Add Income
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Income" value="$6,500.00" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} change="+12.5%" changeColor="green" />
        <SummaryCard title="Total Expenses" value="$3,850.50" icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} change="-4.3%" changeColor="red" />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,149.50</div>
            <div className="h-2 bg-muted mt-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "30%" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">30% of budget remaining</p>
          </CardContent>
        </Card>
        <SummaryCard title="Savings" value="$2,649.50" icon={<ArrowUp className="h-4 w-4 text-muted-foreground" />} change="+18.2%" changeColor="green" />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Spending Categories */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
            <CardDescription>Your highest spending areas this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-muted-foreground">${category.amount.toFixed(2)}</div>
                  </div>
                  <div className="ml-auto font-medium">{category.percent}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest expenses and income</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="font-medium">{transaction.name}</div>
                      <div className="text-sm text-muted-foreground">{transaction.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                      <div className={`font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Extracted card component for reuse
function SummaryCard({ title, value, icon, change, changeColor }: { title: string; value: string; icon: React.ReactNode; change: string; changeColor: "green" | "red" }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs text-muted-foreground flex items-center gap-1 mt-1`}>
          {changeColor === "green" ? (
            <ArrowUpRight className="h-3 w-3 text-green-500" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500" />
          )}
          <span className={`text-${changeColor}-500`}>{change}</span> from last month
        </p>
      </CardContent>
    </Card>
  )
}
