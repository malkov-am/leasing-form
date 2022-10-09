import React, { useCallback, useEffect, useState } from 'react';
import Spinner from '../Spinner/Spinner';
import {
  DEFAULT_CAR_PRICE,
  DEFAULT_DOWN_PAYMENT,
  DEFAULT_LOAN_TERM,
  INTEREST_RATE,
  MAX_CAR_PRICE,
  MAX_DOWN_PAYMENT,
  MAX_LOAN_TERM,
  MIN_CAR_PRICE,
  MIN_DOWN_PAYMENT,
  MIN_LOAN_TERM,
} from '../utils/constants';
import './LeasingForm.scss';

const LeasingForm = ({ isLoading, onSubmit }) => {
  const [carPrice, setCarPrice] = useState({
    value: DEFAULT_CAR_PRICE,
    displayedValue: DEFAULT_CAR_PRICE.toLocaleString(),
    isChange: false,
    min: MIN_CAR_PRICE,
    max: MAX_CAR_PRICE,
  });
  const [downPayment, setDownPayment] = useState({
    value: DEFAULT_DOWN_PAYMENT,
    displayedValue: DEFAULT_DOWN_PAYMENT.toLocaleString(),
    isChange: false,
    min: MIN_DOWN_PAYMENT,
    max: MAX_DOWN_PAYMENT,
  });
  const [downPaymentRub, setDownPaymentRub] = useState({ value: 0, displayedValue: 0 });
  const [loanTerm, setLoanTerm] = useState({
    value: DEFAULT_LOAN_TERM,
    displayedValue: DEFAULT_LOAN_TERM.toLocaleString(),
    isChange: false,
    min: MIN_LOAN_TERM,
    max: MAX_LOAN_TERM,
  });
  const [monthPay, setMonthPay] = useState({ value: 0, displayedValue: 0 });
  const [leasingTotal, setLeasingTotal] = useState({ value: 0, displayedValue: 0 });

  useEffect(() => {
    const slidersList = document.querySelectorAll('.leasing-form__input-range');
    slidersList.forEach((slider) => {
      setTrackGradient(slider);
    });

    const valueInCurrency = Math.round((carPrice.value / 100) * downPayment.value);
    setDownPaymentRub({
      ...downPaymentRub,
      value: valueInCurrency,
      displayedValue: valueInCurrency.toLocaleString(),
    });

    const monthPay = calculateMonthPay();
    setMonthPay({ ...monthPay, value: monthPay, displayedValue: monthPay.toLocaleString() });

    const leasingTotal = calculateLeasingTotal();
    setLeasingTotal({
      ...leasingTotal,
      value: leasingTotal,
      displayedValue: leasingTotal.toLocaleString(),
    });
  }, [carPrice, downPayment, loanTerm, monthPay]);

  const calculateMonthPay = useCallback(() => {
    return Math.round(
      (carPrice.value - downPaymentRub.value) *
        ((INTEREST_RATE * Math.pow(1 + INTEREST_RATE, loanTerm.value)) /
          (Math.pow(1 + INTEREST_RATE, loanTerm.value) - 1)),
    );
  }, [carPrice.value, downPaymentRub.value, loanTerm.value]);

  function calculateLeasingTotal() {
    return downPaymentRub.value + loanTerm.value * monthPay.value;
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onSubmit({
      car_coast: carPrice.value,
      initail_payment: downPaymentRub.value,
      initail_payment_percent: downPayment.value,
      lease_term: loanTerm.value,
      total_sum: leasingTotal.value,
      monthly_payment_from: monthPay.value,
    });
  }

  function calculateTrackPosition(value, min, max) {
    return ((value - min) / (max - min)) * 100;
  }

  function getSliderTrackGradient(percentage) {
    return `linear-gradient(to right, #ff9514 0%, #ff9514 ${percentage}%, #e1e1e1 ${percentage}%, #e1e1e1 100%)`;
  }

  function setTrackGradient(input) {
    const { value, min, max } = input;
    const trackPosition = calculateTrackPosition(value, min, max);
    const sliderTrackGradient = getSliderTrackGradient(trackPosition);
    return (input.style.background = sliderTrackGradient);
  }

  function onInputChange(evt, state, setState) {
    setState({
      ...state,
      value: Number(evt.target.value),
      displayedValue: evt.target.valueAsNumber.toLocaleString(),
    });
  }

  function onInputBlur(state, setState) {
    const value = Math.max(state.min, Math.min(state.max, state.value));
    const displayedValue = value.toLocaleString();
    setState({ ...state, value, displayedValue, isChange: false });
  }

  function onInputFocus(state, setState) {
    setState({ ...state, isChange: true });
  }

  return (
    <div className="leasing-form">
      <h2 className="leasing-form__title">Рассчитайте стоимость автомобиля в лизинг</h2>
      <form className="leasing-form__form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="price" className="leasing-form__input-label">
            Желаемая сумма кредита
          </label>
          <div className="leasing-form__input-wrapper">
            <input
              disabled={isLoading}
              name="price"
              type={carPrice.isChange ? 'number' : 'text'}
              className="leasing-form__input-number"
              min={carPrice.min}
              max={carPrice.max}
              value={carPrice.isChange ? carPrice.value : carPrice.displayedValue}
              onChange={(evt) => onInputChange(evt, carPrice, setCarPrice)}
              onBlur={() => onInputBlur(carPrice, setCarPrice)}
              onFocus={() => onInputFocus(carPrice, setCarPrice)}
            ></input>
            <input
              disabled={isLoading}
              type="range"
              className="leasing-form__input-range"
              min={carPrice.min}
              max={carPrice.max}
              value={carPrice.value}
              onChange={(evt) => onInputChange(evt, carPrice, setCarPrice)}
            />
            <span className="leasing-form__input-number-unit">&#8381;</span>
          </div>
        </div>

        <div>
          <label htmlFor="down" className="leasing-form__input-label">
            Первоначальный взнос
          </label>
          <div className="leasing-form__input-wrapper leasing-form__input-wrapper_type_percentage">
            <span className="leasing-form__input-number">{downPaymentRub.displayedValue}</span>
            <div className="leasing-form__input-down-wrapper">
              <input
                disabled={isLoading}
                name="down"
                type={downPayment.isChange ? 'number' : 'text'}
                className="leasing-form__input-down"
                min={downPayment.min}
                max={downPayment.max}
                value={downPayment.isChange ? downPayment.value : downPayment.displayedValue}
                onChange={(evt) => onInputChange(evt, downPayment, setDownPayment)}
                onBlur={() => onInputBlur(downPayment, setDownPayment)}
                onFocus={() => onInputFocus(downPayment, setDownPayment)}
              ></input>
              <span className="leasing-form__input-number-unit">%</span>
            </div>
            <input
              disabled={isLoading}
              type="range"
              className="leasing-form__input-range"
              min={downPayment.min}
              max={downPayment.max}
              value={downPayment.value}
              onChange={(evt) => onInputChange(evt, downPayment, setDownPayment)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="term" className="leasing-form__input-label">
            Срок лизинга
          </label>
          <div className="leasing-form__input-wrapper">
            <input
              disabled={isLoading}
              name="term"
              type={loanTerm.isChange ? 'number' : 'text'}
              className="leasing-form__input-number"
              min={loanTerm.min}
              max={loanTerm.max}
              value={loanTerm.isChange ? loanTerm.value : loanTerm.displayedValue}
              onChange={(evt) => onInputChange(evt, loanTerm, setLoanTerm)}
              onBlur={() => onInputBlur(loanTerm, setLoanTerm)}
              onFocus={() => onInputFocus(loanTerm, setLoanTerm)}
            ></input>
            <input
              disabled={isLoading}
              type="range"
              className="leasing-form__input-range"
              min={loanTerm.min}
              max={loanTerm.max}
              value={loanTerm.value}
              onChange={(evt) => onInputChange(evt, loanTerm, setLoanTerm)}
            />
            <span className="leasing-form__input-number-unit">мес.</span>
          </div>
        </div>

        <div>
          <p className="leasing-form__text-label">Сумма договора лизинга</p>
          <p className="leasing-form__input-number">{leasingTotal.displayedValue} &#8381;</p>
        </div>

        <div>
          <p className="leasing-form__text-label">Ежемесячный платеж от</p>
          <p className="leasing-form__input-number">{monthPay.displayedValue} &#8381;</p>
        </div>

        <button disabled={isLoading} className="leasing-form__submit-btn" onClick={handleSubmit}>
          {!isLoading ? 'Оставить заявку' : <Spinner />}
        </button>
      </form>
    </div>
  );
};

export default LeasingForm;
