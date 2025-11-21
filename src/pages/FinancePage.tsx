import React, { useEffect, useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Menu,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock API - Replace with your actual API calls
const getFinancialTransactions = async (filters: any) => {
  // Replace with actual API call
  return {
    data: [
      {
        id: 1,
        type: "income",
        amount: 5000,
        paymentMethod: "bkash",
        transactionId: "BKX123456789",
        date: "2025-11-15T10:30:00",
        description: "Patient consultation fee",
        patientName: "John Doe",
        category: "consultation",
      },
      {
        id: 2,
        type: "income",
        amount: 3000,
        paymentMethod: "cash",
        transactionId: null,
        date: "2025-11-15T14:20:00",
        description: "Patient consultation fee",
        patientName: "Jane Smith",
        category: "consultation",
      },
      {
        id: 3,
        type: "expense",
        amount: 1500,
        paymentMethod: "cash",
        transactionId: null,
        date: "2025-11-14T09:00:00",
        description: "Medical supplies",
        sector: "supplies",
        category: "operational",
      },
      {
        id: 4,
        type: "expense",
        amount: 2000,
        paymentMethod: "bkash",
        transactionId: "BKX987654321",
        date: "2025-11-13T16:45:00",
        description: "Equipment maintenance",
        sector: "maintenance",
        category: "operational",
      },
    ],
    summary: {
      totalIncome: 8000,
      totalExpense: 3500,
      netBalance: 4500,
      bkashIncome: 5000,
      cashIncome: 3000,
      bkashExpense: 2000,
      cashExpense: 1500,
    },
  };
};

const addExpense = async (expenseData: any) => {
  // Replace with actual API call
  console.log("Adding expense:", expenseData);
  return { status: 200, data: { id: 123 } };
};

// Types
interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  paymentMethod: "bkash" | "cash";
  transactionId: string | null;
  date: string;
  description: string;
  patientName?: string;
  sector?: string;
  category: string;
}

interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  bkashIncome: number;
  cashIncome: number;
  bkashExpense: number;
  cashExpense: number;
}

// Summary Cards Component
const SummaryCards: React.FC<{ summary: FinancialSummary }> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-700">
              ৳{summary.totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-500 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Expense</p>
            <p className="text-2xl font-bold text-red-700">
              ৳{summary.totalExpense.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-500 p-3 rounded-full">
            <TrendingDown className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Net Balance</p>
            <p className="text-2xl font-bold text-blue-700">
              ৳{summary.netBalance.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-500 p-3 rounded-full">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">bKash Total</p>
            <p className="text-xl font-bold text-purple-700">
              ৳{(summary.bkashIncome - summary.bkashExpense).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-500 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
};

// Search Bar Component
const FinanceSearchBar: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onMenuToggle: () => void;
  onAddExpense: () => void;
}> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onMenuToggle,
  onAddExpense,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border rounded-lg shadow-sm p-3">
      <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
        <Input
          type="text"
          placeholder="Search by transaction ID, description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={onSearch}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onAddExpense}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Expense</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onMenuToggle}
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>
    </div>
  );
};

// Filters Component
const FinanceFilters: React.FC<{
  filterType: string;
  setFilterType: (val: string) => void;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  transactionType: string;
  setTransactionType: (val: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedMonth: string;
  setSelectedMonth: (val: string) => void;
  selectedYear: string;
  setSelectedYear: (val: string) => void;
  selectedWeek: string;
  setSelectedWeek: (val: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}> = ({
  filterType,
  setFilterType,
  paymentMethod,
  setPaymentMethod,
  transactionType,
  setTransactionType,
  selectedDate,
  setSelectedDate,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  selectedWeek,
  setSelectedWeek,
  applyFilters,
  clearFilters,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mt-3 animate-in fade-in duration-150">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filter Type */}
        <div className="space-y-2">
          <Label htmlFor="filterType" className="text-sm font-medium">
            Filter By
          </Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger id="filterType">
              <SelectValue placeholder="Select filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">By Date</SelectItem>
              <SelectItem value="week">By Week</SelectItem>
              <SelectItem value="month">By Month</SelectItem>
              <SelectItem value="year">By Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Picker - Show only when filterType is 'date' */}
        {filterType === "date" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-300",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border shadow-sm"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Week Selector */}
        {filterType === "week" && (
          <div className="space-y-2">
            <Label htmlFor="week" className="text-sm font-medium">
              Select Week
            </Label>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger id="week">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">All Weeks</SelectItem>
                <SelectItem value="current">Current Week</SelectItem>
                <SelectItem value="last">Last Week</SelectItem>
                <SelectItem value="lastTwoWeeks">Last 2 Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Month Selector */}
        {filterType === "month" && (
          <div className="space-y-2">
            <Label htmlFor="month" className="text-sm font-medium">
              Select Month
            </Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger id="month">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">All Months</SelectItem>
                {months.map((month, index) => (
                  <SelectItem key={month} value={String(index + 1)}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Year Selector */}
        {filterType === "year" && (
          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-medium">
              Select Year
            </Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Payment Method */}
        <div className="space-y-2">
          <Label htmlFor="paymentMethod" className="text-sm font-medium">
            Payment Method
          </Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger id="paymentMethod">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">All Methods</SelectItem>
              <SelectItem value="bkash">bKash</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Type */}
        <div className="space-y-2">
          <Label htmlFor="transactionType" className="text-sm font-medium">
            Transaction Type
          </Label>
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger id="transactionType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">All Transactions</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="border-gray-300 hover:bg-gray-100"
        >
          Clear
        </Button>
        <Button
          onClick={applyFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

// Transaction Item Component
const TransactionItem: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isIncome = transaction.type === "income";

  return (
    <Card className="mb-3 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Transaction Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-full",
                isIncome ? "bg-green-100" : "bg-red-100"
              )}
            >
              {isIncome ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-lg">{transaction.description}</h3>
              <p className="text-sm text-gray-600">
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>

          <div className="ml-12 space-y-1 text-sm text-gray-700">
            {transaction.patientName && (
              <p>
                <span className="font-medium">Patient:</span>{" "}
                {transaction.patientName}
              </p>
            )}
            {transaction.sector && (
              <p>
                <span className="font-medium">Sector:</span>{" "}
                {transaction.sector}
              </p>
            )}
            {transaction.transactionId && (
              <p>
                <span className="font-medium">Transaction ID:</span>{" "}
                {transaction.transactionId}
              </p>
            )}
          </div>
        </div>

        {/* Amount and Payment Method */}
        <div className="flex flex-col items-end gap-2">
          <div
            className={cn(
              "text-2xl font-bold",
              isIncome ? "text-green-600" : "text-red-600"
            )}
          >
            {isIncome ? "+" : "-"}৳{transaction.amount.toLocaleString()}
          </div>

          <div className="flex gap-2">
            <Badge
              className={cn(
                "capitalize",
                transaction.paymentMethod === "bkash"
                  ? "bg-pink-100 text-pink-800"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              {transaction.paymentMethod}
            </Badge>
            <Badge
              className={cn(
                "capitalize",
                isIncome
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {transaction.type}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Add Expense Modal Component
const AddExpenseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expenseData: any) => void;
}> = ({ isOpen, onClose, onAddExpense }) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [transactionId, setTransactionId] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = () => {
    if (!amount || !sector || !description) {
      alert("Please fill in all required fields");
      return;
    }

    onAddExpense({
      amount: parseFloat(amount),
      paymentMethod,
      transactionId: paymentMethod === "bkash" ? transactionId : null,
      sector,
      description,
      date: date?.toISOString(),
    });

    // Reset form
    setAmount("");
    setPaymentMethod("cash");
    setTransactionId("");
    setSector("");
    setDescription("");
    setDate(new Date());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Record a new expense transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (৳) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bkash">bKash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === "bkash" && (
            <div className="space-y-2">
              <Label htmlFor="transaction-id">bKash Transaction ID</Label>
              <Input
                id="transaction-id"
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="sector">Sector *</Label>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger id="sector">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supplies">Medical Supplies</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter expense description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Finance Page
const FinancePage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    bkashIncome: 0,
    cashIncome: 0,
    bkashExpense: 0,
    cashExpense: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [filterType, setFilterType] = useState("month");
  const [paymentMethod, setPaymentMethod] = useState("None");
  const [transactionType, setTransactionType] = useState("None");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth() + 1)
  );
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );
  const [selectedWeek, setSelectedWeek] = useState("None");

  // Modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const fetchTransactions = async (filters?: any) => {
    setIsLoading(true);
    try {
      const effectiveFilters = filters ?? {
        filterType,
        paymentMethod,
        transactionType,
        selectedDate,
        selectedMonth,
        selectedYear,
        selectedWeek,
        search: searchQuery,
      };

      const response = await getFinancialTransactions(effectiveFilters);
      setTransactions(response.data || []);
      setSummary(response.summary);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useMemo(
    () =>
      debounce(() => {
        fetchTransactions({
          filterType,
          paymentMethod,
          transactionType,
          selectedDate,
          selectedMonth,
          selectedYear,
          selectedWeek,
          search: searchQuery,
        });
      }, 400),
    [
      filterType,
      paymentMethod,
      transactionType,
      selectedDate,
      selectedMonth,
      selectedYear,
      selectedWeek,
      searchQuery,
    ]
  );

  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [
    searchQuery,
    filterType,
    paymentMethod,
    transactionType,
    selectedDate,
    selectedMonth,
    selectedYear,
    selectedWeek,
  ]);

  const applyFilters = () => {
    fetchTransactions();
  };

  const clearFilters = () => {
    setFilterType("month");
    setPaymentMethod("None");
    setTransactionType("None");
    setSelectedDate(undefined);
    setSelectedMonth(String(new Date().getMonth() + 1));
    setSelectedYear(String(new Date().getFullYear()));
    setSelectedWeek("None");
    setSearchQuery("");
  };

  const handleAddExpense = async (expenseData: any) => {
    try {
      await addExpense(expenseData);
      alert("Expense added successfully!");
      setIsExpenseModalOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Finance Management</h1>
        <p className="text-gray-600 mb-6">
          Track income, expenses, and financial transactions
        </p>

        {/* Summary Cards */}
        <SummaryCards summary={summary} />

        <div className="space-y-4">
          <FinanceSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={() => fetchTransactions()}
            onMenuToggle={() => setShowFilters(!showFilters)}
            onAddExpense={() => setIsExpenseModalOpen(true)}
          />

          {showFilters && (
            <FinanceFilters
              filterType={filterType}
              setFilterType={setFilterType}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              transactionType={transactionType}
              setTransactionType={setTransactionType}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
            />
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
};

export default FinancePage;
