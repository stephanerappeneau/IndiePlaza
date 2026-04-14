import React, { FC, useEffect, useState } from 'react';
import { extractRevenueRatios } from '@/utils/simulatorCalculations';
import { fetchSimulatorParams } from '@/utils/simulator_api';

interface NetRevenuesMultiplierProps {
  formValues: any;
}

const NetRevenuesMultiplier: FC<NetRevenuesMultiplierProps> = ({
  formValues,
}) => {
  const totalWeeks = 156;
  const [conversionRateTable, setConversionRateTable] = useState<any>({});

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const params = await fetchSimulatorParams();
        setConversionRateTable(params.conversionRateTable);
      } catch (error) {
        console.error('Failed to fetch parameters:', error);
      }
    };
    fetchParams();
  }, []);

  try {
    const {
      firstWeekRevenue,
      firstMonthRevenue,
      firstYearRevenue,
      secondYearRevenue,
      thirdYearRevenue,
      ratioMonthToWeek1,
      ratioYear1ToWeek1,
      ratioYear2ToWeek1,
      ratioYear3ToWeek1,
    } = extractRevenueRatios(formValues, totalWeeks, conversionRateTable);

    const thousandSeparator = (num: number): string => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const headers = ['', 'Week 1', 'Month 1', 'Year 1', 'Year 2', 'Year 3'];

    const rows = [
      [
        'Total Net Revenues',
        `${thousandSeparator(firstWeekRevenue)} €`,
        `${thousandSeparator(firstMonthRevenue)} €`,
        `${thousandSeparator(firstYearRevenue)} €`,
        `${thousandSeparator(secondYearRevenue)} €`,
        `${thousandSeparator(thirdYearRevenue)} €`,
      ],
      [
        'Revenues multiplier / Week 1',
        '',
        `x${ratioMonthToWeek1.toFixed(1)}`,
        `x${ratioYear1ToWeek1.toFixed(1)}`,
        `x${ratioYear2ToWeek1.toFixed(1)}`,
        `x${ratioYear3ToWeek1.toFixed(1)}`,
      ],
    ];

    return (
      <div className="overflow-x-auto">
        <table className="bg-white border border-gray-200 min-w-max w-full">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-2 text-sm text-gray-700 border-b ${
                      cellIndex === 0 ? 'font-bold' : ''
                    } whitespace-nowrap`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    console.error('Error calculating revenues:', error);
    return <div>Error calculating revenues</div>;
  }
};

export default NetRevenuesMultiplier;
