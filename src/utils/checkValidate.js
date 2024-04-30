import React, { useState } from 'react';
import validate from 'validate.js';

export const CheckLoginValidate = (data) => {
  validate.options = { fullMessages: false }

  const rules = {
    email: {
      presence: {
        allowEmpty: false, message: "이메일은 필수항목 입니다."
      },
      email: {
        message: "유효한 이메일 주소를 입력하세요."
      },
    },
    pw: {
      presence: {
        allowEmpty: false,
        message: "비밀번호는 필수항목 입니다."
      },
      length: {
        minimum: 6,
        message: "최소 6자 이상이어야 합니다."
      }
    }
  };

  const validationErrors = validate(data, rules);
  if (!validationErrors) {
    console.log('유효한 폼입니다. 제출 중...');
  }

  return validationErrors || {};
}

export const CheckForgotValidate = (data) => {
  validate.options = { fullMessages: false }

  const rules = {
    email: {
      presence: {
        allowEmpty: false, message: "이메일은 필수항목 입니다."
      },
      email: {
        message: "유효한 이메일 주소를 입력하세요."
      },
    }
  };

  const validationErrors = validate(data, rules);
  if (!validationErrors) {
    console.log('유효한 폼입니다. 제출 중...');
  }

  return validationErrors || {};

}

export const CheckSignupValidate = (data) => {
  validate.options = { fullMessages: false }

  const rules = {
    email: {
      presence: { allowEmpty: false, message: "이메일은 필수항목 입니다." },
      email: {
        message: "유효한 이메일 주소를 입력하세요."
      }
    },
    nickname: {
      presence: { allowEmpty: false, message: "닉네임은 필수항목 입니다." }
    },
    pw: {
      presence: { allowEmpty: false, message: "비밀번호는 필수항목 입니다." },
      length: {
        minimum: 6,
        message: "비밀번호는 최소 6자 이상이어야 합니다."
      }
    },
    pwAgain: {
      equality: {
        attribute: "pw",
        message: "비밀번호가 일치하지 않습니다.",
        comparator: function (v1, v2) {
          return v1 === v2;
        }
      }
    }
  };

  const validationErrors = validate(data, rules);
  if (!validationErrors) {
    console.log("유효한 폼입니다. 제출 중...");
  }

  return validationErrors || {};
}
