/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import { round, toNumber } from "lodash";
import { allPass, andThen, compose, curry, flip, gt, ifElse, length, lt, otherwise, pipe, tap, test } from "ramda";
import Api from "../tools/api";

const api = new Api();

const lessThen = curry(flip(lt));
const moreThen = curry(flip(gt));
const isPositive = value => Number(value) >= 0;
const checkLength = allPass([lessThen(10), moreThen(2)]);
const toRounded = compose(round, toNumber);
const validateValue = allPass([pipe(length, checkLength), isPositive, test(/^[0-9]*\.?[0-9]+$|^[0-9]+\.?[0-9]*$/)]);

const getBinary = async number =>
	(
		await api.get("https://api.tech/numbers/base", {
			from: 10,
			to: 2,
			number: toRounded(number),
		})
	).result;

const getAnimal = async remainder => (await api.get(`https://animals.tech/${remainder}`, {})).result;

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
	const log = tap(writeLog);
	const apiError = () => handleError("Api error");
	const validationError = () => handleError("ValidationError");

	const processingPipeline = pipe(
		log,
		ifElse(
			validateValue,
			pipe(
				toRounded,
				log,
				getBinary,
				andThen(
					pipe(
						log,
						length,
						log,
						len => Math.pow(len, 2),
						log,
						pow => pow % 3,
						log,
						getAnimal,
						andThen(handleSuccess),
						otherwise(apiError)
					)
				),
				otherwise(apiError)
			),
			validationError
		)
	);

	processingPipeline(value);
};

export default processSequence;
