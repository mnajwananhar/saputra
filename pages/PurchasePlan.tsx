import React, { useMemo, useState } from "react";
import { useProducts } from "../contexts/ProductContext";
import { useTransactions } from "../contexts/TransactionContext";
import { useSuppliers } from "../contexts/SupplierContext";
import {
  calculateSMA,
  calculateSafetyStock,
  aggregateTransactionsToMonthly,
  findBestN,
} from "../utils";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agt",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const PurchasePlan: React.FC = () => {
  const { products } = useProducts();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { suppliers } = useSuppliers();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Auto-detect latest month from transactions
  const latestDataDate = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return new Date();
    }

    const latestDate = transactions.reduce((latest, transaction) => {
      const transDate = new Date(transaction.date);
      return transDate > latest ? transDate : latest;
    }, new Date(0));

    return latestDate;
  }, [transactions]);

  // Default target = bulan depan dari data terakhir
  const defaultTargetMonth = latestDataDate.getMonth() + 1; // 0-indexed + 1 = next month
  const defaultTargetYear =
    defaultTargetMonth > 11
      ? latestDataDate.getFullYear() + 1
      : latestDataDate.getFullYear();
  const adjustedDefaultMonth = defaultTargetMonth > 11 ? 0 : defaultTargetMonth;

  const [targetMonth, setTargetMonth] = useState(adjustedDefaultMonth); // 0-indexed
  const [targetYear, setTargetYear] = useState(defaultTargetYear);

  // Generate year options berdasarkan range data yang ada
  const yearOptions = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      const currentYear = new Date().getFullYear();
      return [currentYear - 1, currentYear];
    }

    // Cari tahun paling awal dari data
    const earliestYear = transactions.reduce((earliest, transaction) => {
      const transYear = new Date(transaction.date).getFullYear();
      return transYear < earliest ? transYear : earliest;
    }, latestDataDate.getFullYear());

    const latestYear = latestDataDate.getFullYear();

    // Range dari tahun paling awal sampai latest year (bukan +1, karena cuma forecast +1 bulan)
    const years: number[] = [];
    for (let year = earliestYear; year <= latestYear; year++) {
      years.push(year);
    }

    return years;
  }, [transactions, latestDataDate]);

  // Generate month options berdasarkan tahun yang dipilih dan data yang ada
  const monthOptions = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return Array.from({ length: 12 }, (_, i) => i);
    }

    // Collect semua bulan yang ada data untuk tahun yang dipilih
    const monthsInYear = new Set<number>();

    transactions.forEach((transaction) => {
      const transDate = new Date(transaction.date);
      if (transDate.getFullYear() === targetYear) {
        monthsInYear.add(transDate.getMonth());
      }
    });

    // Convert ke array dan sort
    const months = Array.from(monthsInYear).sort((a, b) => a - b);

    // Jika tahun == latest year, tambah +1 bulan untuk forecast target
    if (targetYear === latestDataDate.getFullYear()) {
      const nextMonth = latestDataDate.getMonth() + 1;
      if (nextMonth <= 11 && !months.includes(nextMonth)) {
        months.push(nextMonth);
      }
    }

    return months;
  }, [transactions, targetYear, latestDataDate]);

  // Target periode label
  const targetPeriodLabel = `${MONTHS[targetMonth]} ${targetYear}`;

  // Calculate data range: sampai bulan sebelum target
  const dataRangeLabel = useMemo(() => {
    // Bulan sebelum target
    const dataEndMonth = targetMonth === 0 ? 11 : targetMonth - 1;
    const dataEndYear = targetMonth === 0 ? targetYear - 1 : targetYear;

    const endLabel = `${MONTHS_SHORT[dataEndMonth]}-${dataEndYear.toString().slice(-2)}`;

    return `Data s/d ${endLabel}`;
  }, [targetMonth, targetYear]);

  // Navigate month
  const goToPreviousMonth = (): void => {
    if (targetMonth === 0) {
      setTargetMonth(11);
      setTargetYear((prev) => prev - 1);
    } else {
      setTargetMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = (): void => {
    if (targetMonth === 11) {
      setTargetMonth(0);
      setTargetYear((prev) => prev + 1);
    } else {
      setTargetMonth((prev) => prev + 1);
    }
  };

  const planData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Tentukan range data sampai bulan sebelum target
    // Misal target = Maret 2026 (targetMonth=2), maka data sampai akhir Feb 2026
    const dataEndMonth = targetMonth === 0 ? 11 : targetMonth - 1;
    const dataEndYear = targetMonth === 0 ? targetYear - 1 : targetYear;
    const endDate = new Date(dataEndYear, dataEndMonth + 1, 0); // Last day of data end month

    console.log("🎯 Target:", MONTHS[targetMonth], targetYear);
    console.log("📅 Data sampai:", MONTHS[dataEndMonth], dataEndYear);
    console.log("🔚 End date:", endDate);
    console.log("📦 Total transactions:", transactions.length);

    // Aggregate semua produk dulu untuk mendapatkan semua bulan yang ada
    const allMonthlyDataByProduct = new Map<
      string,
      { month: number; year: number; demand: number }[]
    >();

    products.forEach((product) => {
      const productTransactions = transactions.filter((transaction) => {
        if (!transaction.items.some((item) => item.productId === product.id))
          return false;

        const transDate = new Date(transaction.date);
        return transDate <= endDate;
      });

      const monthlyData = aggregateTransactionsToMonthly(productTransactions);
      allMonthlyDataByProduct.set(
        product.id,
        monthlyData.map((d) => {
          // d.month is string like "Jan", "Feb", etc - need to convert back to number
          const monthIndex = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Agt",
            "Sep",
            "Okt",
            "Nov",
            "Des",
          ].indexOf(d.month);
          return {
            month: monthIndex, // Already 0-indexed
            year: d.year,
            demand: d.demand,
          };
        }),
      );
    });

    // Cari earliest transaction date untuk generate range bulan lengkap
    const earliestDate = transactions.reduce((earliest, transaction) => {
      const transDate = new Date(transaction.date);
      return transDate < earliest ? transDate : earliest;
    }, endDate);

    // Generate semua bulan dari earliest sampai endDate
    const sortedMonths: { year: number; month: number }[] = [];
    const currentDate = new Date(
      earliestDate.getFullYear(),
      earliestDate.getMonth(),
      1,
    );

    while (currentDate <= endDate) {
      sortedMonths.push({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return products.map((product) => {
      const productData = allMonthlyDataByProduct.get(product.id) || [];

      console.log(
        `📊 ${product.name}: ${productData.length} months data`,
        productData.slice(0, 3),
      );

      // Fill missing months dengan 0
      const filledData = sortedMonths.map(({ year, month }) => {
        const existing = productData.find(
          (d) => d.year === year && d.month === month,
        );
        return {
          id: `${product.id}-${year}-${month}`,
          month: (month + 1).toString().padStart(2, "0"), // Convert back to 1-indexed string
          year,
          demand: existing ? existing.demand : 0,
          periodLabel: `${MONTHS_SHORT[month]}-${year.toString().slice(-2)}`,
        };
      });

      // Auto select best N menggunakan findBestN
      const bestN = findBestN(filledData);
      const { nextPeriodForecast, metrics } = calculateSMA(filledData, bestN);
      const demands = filledData.map((d) => d.demand);
      const dynamicSafetyStock = calculateSafetyStock(demands);
      const forecastRounded = Math.ceil(nextPeriodForecast);

      if (product.name.includes("Kapal Api")) {
        console.log("🔍 Kapal Api Debug:");
        console.log("  Last 4 months:", filledData.slice(-4));
        console.log("  Best N:", bestN);
        console.log("  nextPeriodForecast (raw):", nextPeriodForecast);
        console.log("  forecastRounded:", forecastRounded);
      }

      const orderQuantity =
        forecastRounded + dynamicSafetyStock - product.stock.currentStock;

      const supplier = suppliers.find((s) => s.id === product.supplierId);

      return {
        ...product,
        supplier,
        forecast: forecastRounded,
        calculatedSafety: dynamicSafetyStock,
        orderQuantity: Math.max(0, Math.ceil(orderQuantity)),
        dataMonths: filledData.length,
        bestN, // Store best N yang digunakan
        mape: metrics.mape, // Store MAPE untuk display
      };
    });
  }, [products, transactions, suppliers, targetMonth, targetYear]);

  const filteredPlanData = useMemo(() => {
    let data = planData;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.supplier?.name.toLowerCase().includes(query) ||
          item.unit.toLowerCase().includes(query),
      );
    }

    return [...data].sort((a, b) => b.orderQuantity - a.orderQuantity);
  }, [planData, searchQuery]);

  const totalPages = Math.ceil(filteredPlanData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPlanData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPlanData, currentPage, itemsPerPage]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Loading State */}
      {transactionsLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-900">
                Memuat Data Transaksi
              </p>
              <p className="text-sm text-slate-500">Mohon tunggu sebentar...</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tighter leading-none uppercase">
                  Rencana Beli
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-3">
                  Target Stok: {targetPeriodLabel} • {dataRangeLabel}
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari produk atau supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-4 py-3 w-full md:w-72 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Filter Periode Target */}
            <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Periode Target:
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-600" />
                </button>

                <select
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(parseInt(e.target.value))}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                >
                  {monthOptions.map((monthIndex) => (
                    <option key={monthIndex} value={monthIndex}>
                      {MONTHS[monthIndex]}
                    </option>
                  ))}
                </select>

                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(parseInt(e.target.value))}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <button
                  onClick={goToNextMonth}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-auto max-h-[600px]">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 sticky top-0 z-10">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest">
                      Nama Produk
                    </th>
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-right">
                      Satuan
                    </th>
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-right">
                      Ramalan Kebutuhan
                    </th>
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-right">
                      Safety Stock
                    </th>
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-right">
                      Stok Gudang
                    </th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-right bg-indigo-50/50 text-indigo-600">
                      Rekomendasi Order
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900 text-[11px] uppercase tracking-widest">
                          {item.name}
                        </div>
                        {item.supplier && (
                          <div className="text-[9px] text-slate-400 mt-1">
                            Supplier: {item.supplier.name}
                          </div>
                        )}
                        <div className="text-[9px] text-indigo-500 mt-1 font-semibold">
                          N={item.bestN} • MAPE={item.mape.toFixed(2)}%
                        </div>
                        {item.dataMonths < 3 && (
                          <div className="text-[9px] text-amber-500 mt-1">
                            ⚠️ Data hanya {item.dataMonths} bulan
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6 text-right text-slate-600 font-bold text-[11px] tabular-nums">
                        {item.unit}
                      </td>
                      <td className="px-6 py-6 text-right text-slate-600 font-bold text-[11px] tabular-nums">
                        {item.forecast}
                      </td>
                      <td className="px-6 py-6 text-right text-indigo-600 font-bold text-[11px] tabular-nums">
                        +{item.calculatedSafety}
                      </td>
                      <td className="px-6 py-6 text-right text-slate-900 font-bold text-[11px] tabular-nums">
                        {item.stock.currentStock}
                      </td>
                      <td className="px-8 py-6 text-right bg-indigo-50/30">
                        <span
                          className={`font-heading font-extrabold text-xl tabular-nums ${item.orderQuantity > 0 ? "text-indigo-600" : "text-slate-400"}`}
                        >
                          {item.orderQuantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPlanData.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
                  {searchQuery
                    ? "Tidak ada produk yang cocok"
                    : "Belum ada produk"}
                </p>
                <p className="text-slate-300 text-xs mt-1">
                  {searchQuery
                    ? "Coba kata kunci lain"
                    : "Tambahkan produk di Data Master"}
                </p>
              </div>
            )}

            {filteredPlanData.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-200 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-600 font-semibold">
                    Menampilkan {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredPlanData.length,
                    )}{" "}
                    dari {filteredPlanData.length} produk
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={10}>10 / halaman</option>
                    <option value={20}>20 / halaman</option>
                    <option value={50}>50 / halaman</option>
                    <option value={100}>100 / halaman</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronsLeft className="h-4 w-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                  </button>

                  <div className="flex items-center gap-1 px-3">
                    <span className="text-sm font-bold text-slate-900">
                      {currentPage}
                    </span>
                    <span className="text-sm text-slate-400">/</span>
                    <span className="text-sm text-slate-600">{totalPages}</span>
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronsRight className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PurchasePlan;
