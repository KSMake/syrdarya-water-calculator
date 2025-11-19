import type { FlowCalculationResult } from '../types/river';

export function exportToPDF(
  fromPost: string,
  toPost: string,
  flowRate: number,
  result: FlowCalculationResult
) {
  const content = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>Расчёт добегания воды</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            color: #1e40af;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
          }
          .label {
            font-weight: bold;
            color: #475569;
          }
          .value {
            color: #1e293b;
          }
          .highlight {
            background: #dbeafe;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .highlight h2 {
            color: #1e40af;
            font-size: 32px;
            margin: 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
          }
          .warning {
            background: #fef3c7;
            padding: 15px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <h1>Калькулятор добегания воды</h1>
        <p style="color: #64748b;">Река Нарын–Сырдарья</p>

        <div style="margin: 30px 0;">
          <div class="info-row">
            <span class="label">От:</span>
            <span class="value">${fromPost}</span>
          </div>
          <div class="info-row">
            <span class="label">До:</span>
            <span class="value">${toPost}</span>
          </div>
          <div class="info-row">
            <span class="label">Расход воды (попуск):</span>
            <span class="value">${flowRate} м³/с</span>
          </div>
          <div class="info-row">
            <span class="label">Расстояние:</span>
            <span class="value">${result.distance_km} км</span>
          </div>
        </div>

        <div class="highlight">
          <p style="margin: 0; color: #475569;">Среднее время добегания</p>
          <h2>${result.avg_time_formatted}</h2>
        </div>

        <div style="margin: 30px 0;">
          <div class="info-row">
            <span class="label">Минимальное время:</span>
            <span class="value" style="color: #16a34a;">${result.min_time_formatted}</span>
          </div>
          <div class="info-row">
            <span class="label">Максимальное время:</span>
            <span class="value" style="color: #ea580c;">${result.max_time_formatted}</span>
          </div>
        </div>

        ${result.hasResetPoint ? `
          <div class="warning">
            <strong>Внимание: Reset Point</strong><br>
            На маршруте расположен гидроузел ${result.resetPointName || 'Бахри Точик'}.
            Время рассчитано для участка после данного узла.
          </div>
        ` : ''}

        <div class="footer">
          <p>Дата расчёта: ${new Date().toLocaleString('ru-RU')}</p>
          <p>Данные: БВО "Сырдарья" при стабильном попуске 300 м³/с</p>
          <p>Точность расчёта: ±10-15%</p>
          <p style="margin-top: 10px; font-style: italic;">Это пилотная версия. Возможны неточности. Система находится в стадии разработки.</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

export function exportToCSV(
  fromPost: string,
  toPost: string,
  flowRate: number,
  result: FlowCalculationResult
) {
  const rows = [
    ['Калькулятор добегания воды - Река Нарын–Сырдарья'],
    [''],
    ['Параметр', 'Значение'],
    ['От', fromPost],
    ['До', toPost],
    ['Расход воды (попуск)', `${flowRate} м³/с`],
    ['Расстояние', `${result.distance_km} км`],
    [''],
    ['Время добегания'],
    ['Минимальное', result.min_time_formatted],
    ['Среднее', result.avg_time_formatted],
    ['Максимальное', result.max_time_formatted],
    [''],
    ['Reset Point', result.hasResetPoint ? `Да (${result.resetPointName})` : 'Нет'],
    [''],
    ['Дата расчёта', new Date().toLocaleString('ru-RU')],
    ['Источник данных', 'БВО "Сырдарья" при стабильном попуске 300 м³/с'],
    ['Точность', '±10-15%'],
    ['Примечание', 'Пилотная версия. Возможны неточности.'],
  ];

  const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `расчет_${fromPost}_${toPost}_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
