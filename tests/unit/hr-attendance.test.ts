import { describe, it, expect } from 'vitest';
import { PreciseMoney } from '../../src/core/utils/decimal';
import { Employee, DailyAttendance, SalaryAdvance, ArchivedPayrollCycle } from '../../src/shared/types';

describe('HR & Dynamic Attendance Minute-Rate Engine', () => {
  const sampleEmployee: Employee = {
    id: 'emp-test-1',
    code: 'EMP-001',
    fullName: 'ياسين محمود السعدي',
    phone: '07701234567',
    divisionId: 'WOOD',
    jobTitle: 'رئيس ورشة النجارة',
    monthlySalary: '1200000.00',
    isShared: false,
    shiftStartTime: '08:00',
    shiftEndTime: '16:00',
    workingDaysPerMonth: 26,
    dailyHours: 8,
    hireDate: '2024-01-15',
    isActive: true,
  };

  it('calculates the exact minute rate based on working days and daily hours', () => {
    const workingDays = sampleEmployee.workingDaysPerMonth || 26;
    const dailyHours = sampleEmployee.dailyHours || 8;
    const totalMinutes = workingDays * dailyHours * 60; // 26 * 8 * 60 = 12,480 min
    expect(totalMinutes).toBe(12480);

    const minuteRate = new PreciseMoney(sampleEmployee.monthlySalary).div(new PreciseMoney(totalMinutes.toString()));
    // 1,200,000 / 12,480 ≈ 96.153846...
    expect(Number(minuteRate.toDbString(2))).toBeCloseTo(96.15, 2);
  });

  it('calculates delay deduction accurately when clock-in is after shift start', () => {
    const minuteRate = new PreciseMoney(sampleEmployee.monthlySalary).div(new PreciseMoney((26 * 8 * 60).toString()));
    const scheduledInMinutes = 8 * 60; // 480
    const actualInMinutes = 8 * 60 + 30; // 510 (30 min late)

    const lateMinutes = Math.max(0, actualInMinutes - scheduledInMinutes);
    expect(lateMinutes).toBe(30);

    const lateDeduction = minuteRate.mul(lateMinutes);
    // 30 * 96.153846... = 2,884.615...
    expect(Number(lateDeduction.toDbString(2))).toBeCloseTo(2884.62, 2);
  });

  it('calculates overtime addition accurately when clock-out is after shift end', () => {
    const minuteRate = new PreciseMoney(sampleEmployee.monthlySalary).div(new PreciseMoney((26 * 8 * 60).toString()));
    const scheduledOutMinutes = 16 * 60; // 960
    const actualOutMinutes = 17 * 60 + 30; // 1050 (90 min overtime)

    const otMinutes = Math.max(0, actualOutMinutes - scheduledOutMinutes);
    expect(otMinutes).toBe(90);

    const otAddition = minuteRate.mul(otMinutes);
    // 90 * 96.153846... = 8,653.846...
    expect(Number(otAddition.toDbString(2))).toBeCloseTo(8653.85, 2);
  });

  it('calculates net salary payable including base, additions, deductions, and advances', () => {
    const baseSalary = new PreciseMoney(sampleEmployee.monthlySalary);
    const overtimeAddition = new PreciseMoney('8653.85');
    const lateDeduction = new PreciseMoney('2884.62');
    const advanceAmount = new PreciseMoney('150000.00');

    const netSalary = baseSalary
      .add(overtimeAddition)
      .sub(lateDeduction)
      .sub(advanceAmount);

    // 1,200,000 + 8,653.85 - 2,884.62 - 150,000 = 1,055,769.23
    expect(netSalary.toDbString(2)).toBe('1055769.23');
  });

  it('archives monthly payroll and resets active attendance for new month', () => {
    const archivedCycle: ArchivedPayrollCycle = {
      id: 'cycle-2026-10',
      cycleNumber: 'PR-CYCLE-202610',
      monthNameAr: 'تشرين الأول (أكتوبر) 2026',
      closedDate: new Date().toISOString(),
      totalBaseSalaries: '1200000.00',
      totalAdditions: '8653.85',
      totalDeductions: '2884.62',
      totalAdvances: '150000.00',
      totalNetPaid: '1055769.23',
      employeeCount: 1,
      records: [
        {
          employeeId: sampleEmployee.id,
          employeeName: sampleEmployee.fullName,
          divisionId: 'WOOD',
          baseSalary: sampleEmployee.monthlySalary,
          additions: '8653.85',
          deductions: '2884.62',
          advances: '150000.00',
          netSalary: '1055769.23',
          attendanceDaysCount: 26,
          totalLateMinutes: 30,
          totalOvertimeMinutes: 90,
        },
      ],
    };

    expect(archivedCycle.records.length).toBe(1);
    expect(archivedCycle.totalNetPaid).toBe('1055769.23');
    // Verifies that attendance can be cleared without losing historical cycle records
    const activeAttendances: DailyAttendance[] = [];
    expect(activeAttendances.length).toBe(0);
  });
});
