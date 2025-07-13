/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { countBy } from "lodash";
import {
	allPass,
	any,
	anyPass,
	apply,
	complement,
	curry,
	equals,
	filter,
	flip,
	gte,
	includes,
	juxt,
	length,
	omit,
	pipe,
	prop,
	props,
	propSatisfies,
	values,
} from "ramda";

const isWhite = equals("white");
const isRed = equals("red");
const isGreen = equals("green");
const isBlue = equals("blue");
const isOrange = equals("orange");

const isColor = anyPass([isBlue, isGreen, isWhite, isRed, isOrange]);

const filterBy = pred => filter(pred);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
	propSatisfies(isRed, "star"),
	propSatisfies(isGreen, "square"),
	propSatisfies(isWhite, "triangle"),
	propSatisfies(isWhite, "circle"),
]);

// 2. Как минимум две фигуры зеленые.

const countGreen = pipe(values, filterBy(isGreen), length);
const moreOrEqualThen = curry(flip(gte));
const moreThenTwo = moreOrEqualThen(2);

export const validateFieldN2 = pipe(countGreen, moreThenTwo);

// 3. Количество красных фигур равно кол-ву синих.
const countBlue = pipe(filterBy(isBlue), length);
const countRed = pipe(filterBy(isRed), length);
export const validateFieldN3 = pipe(values, juxt([countRed, countBlue]), apply(equals));

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
	propSatisfies(isRed, "star"),
	propSatisfies(isOrange, "square"),
	propSatisfies(isBlue, "circle"),
	propSatisfies(isColor, "triangle"),
]);

const moreOrEqualThenThree = moreOrEqualThen(3);
// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(values, countBy, omit(["white"]), values, any(moreOrEqualThenThree));

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const isTriangleGreen = propSatisfies(isGreen, "triangle");

export const validateFieldN6 = allPass([
	pipe(values, filter(isGreen), length, moreOrEqualThen(2)),
	isTriangleGreen,
	pipe(values, filter(isRed), length, moreOrEqualThen(1)),
	pipe(values, colors => pipe(filterBy(isGreen), length)(colors) <= 2 && pipe(filterBy(isRed), length)(colors) <= 1),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = pipe(values, filterBy(isOrange), length, moreOrEqualThen(4));

// 8. Не красная и не белая звезда, остальные – любого цвета.
const isNotRedOrWhite = complement(curry(flip(includes)(["red", "white"])));
export const validateFieldN8 = allPass([propSatisfies(isNotRedOrWhite, "star")]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = pipe(values, filterBy(isGreen), length, moreOrEqualThen(4));

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
const isNotWhite = complement(equals("white"));
const triangleAndSquareSameColor = pipe(props(["triangle", "square"]), apply(equals));
export const validateFieldN10 = allPass([
	triangleAndSquareSameColor,
	pipe(prop("triangle"), isNotWhite),
	pipe(prop("square"), isNotWhite),
]);
