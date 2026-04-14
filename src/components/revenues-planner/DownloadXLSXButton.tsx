import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  generateCSV,
  generateMonthlyCSV,
  aggregateMonthlyData,
} from './xlsxUtils';
import { calculateRevenues } from '@/utils/simulatorCalculations';
import { fetchSimulatorParams } from '@/utils/simulator_api';
import { FormValues } from './section/types';

const DownloadXLSXButton = ({
  formValues,
  weeksNumber,
}: {
  formValues: FormValues;
  weeksNumber: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [conversionRateTable, setConversionRateTable] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    fetchSimulatorParams().then((params) => {
      setConversionRateTable((params as any).conversionRateTable ?? {});
    });
  }, []);

  const handleDownloadCSV = async () => {
    setLoading(true);
    try {
      const ExcelJS = await import('exceljs');
      const launchDate = new Date(formValues.launchDate);
      const weeklyData = await calculateRevenues(
        formValues,
        weeksNumber,
        conversionRateTable,
      );
      const monthlyData = aggregateMonthlyData(weeklyData, launchDate);
      const weeklyCSVContent = generateCSV(weeklyData, launchDate);
      const monthlyCSVContent = generateMonthlyCSV(monthlyData, launchDate);

      const wb = new ExcelJS.Workbook();

      const addSheet = (name: string, data: (string | number)[][]) => {
        const ws = wb.addWorksheet(name);
        ws.columns = data[0].map(() => ({ width: 20 }));
        ws.addRows(data);
        ws.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;
          row.eachCell((cell) => {
            if (typeof cell.value === 'number') {
              cell.numFmt = '#,##0';
            }
          });
        });
      };

      addSheet('Weekly Data', weeklyCSVContent);
      addSheet('Monthly Data', monthlyCSVContent);

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'revenue_data.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownloadCSV}
      disabled={loading}
      className="flex justify-center items-center gap-1 border-2 border-gray-300 py-2 px-2 rounded-3xl min-w-fit w-1/2 hover:opacity-70"
    >
      <Image
        alt="download csv"
        width={20}
        height={20}
        src="/assets/download.svg"
      />
      <p>Export Data</p>
    </button>
  );
};

export default DownloadXLSXButton;
