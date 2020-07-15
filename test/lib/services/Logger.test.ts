import sinon from 'sinon';

import Logger, {
  BANTAM,
  infoMsg,
  successMsg,
  errorMsg,
} from '../../../src/lib/services/Logger';

afterEach(() => {
  sinon.restore();
});

test('Logger can write to stdout', () => {
  const mockWrite = jest.fn();
  const writeStream = { write: mockWrite };
  const message = 'Example Msg';
  // @ts-expect-error
  const logger = new Logger(writeStream);
  // @ts-expect-error
  logger.write(message);
  expect(mockWrite).toHaveBeenCalledWith(`${BANTAM}${message}\n`);
});

test('Logger can write info message', () => {
  const logger = new Logger();
  const writeStub = sinon.stub(logger, 'write');
  const message = 'Example Msg';
  logger.info(message);
  expect(writeStub.calledOnceWith(infoMsg(message))).toBeTruthy();
});

test('Logger can write success message', () => {
  const logger = new Logger();
  const writeStub = sinon.stub(logger, 'write');
  const message = 'Example Msg';
  logger.success(message);
  expect(writeStub.calledOnceWith(successMsg(message))).toBeTruthy();
});

test('Logger can write error message', () => {
  const logger = new Logger();
  const writeStub = sinon.stub(logger, 'write');
  const message = 'Example Msg';
  logger.error(message);
  expect(writeStub.calledOnceWith(errorMsg(message))).toBeTruthy();
});
