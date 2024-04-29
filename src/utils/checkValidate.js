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
  // console.log(data)
  // console.log(rules)
  // console.log(validationErrors)

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
  console.log(data)
  console.log(rules)
  console.log(validationErrors)

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
    name: {
      presence: { allowEmpty: false, message: "이름은 필수항목 입니다." }
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
  console.log(data)
  console.log(rules)
  console.log(validationErrors)

  return validationErrors || {};
}

// const RegistrationForm = () => {
//     const [formValues, setFormValues] = useState({
//         email: '',
//         password: ''
//     });
//     const [errors, setErrors] = useState({});

//     const constraints = {
//         email: {
//             // 이메일이 유효한 형식인지 검사
//             email: true,
//             presence: { allowEmpty: false }
//         },
//         password: {
//             // 비밀번호가 최소 6자 이상인지 검사
//             length: {
//                 minimum: 6,
//                 message: "must be at least 6 characters long"
//             }
//         }
//     };

//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setFormValues(prevValues => ({ ...prevValues, [name]: value }));
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         const validationErrors = validate(formValues, constraints);
//         setErrors(validationErrors || {});
//         if (!validationErrors) {
//             console.log('Form is valid: Submitting...');
//             // 폼 제출 로직 구현
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} noValidate>
//             <div>
//                 <label htmlFor="email">Email:</label>
//                 <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formValues.email}
//                     onChange={handleChange}
//                 />
//                 {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
//             </div>
//             <div>
//                 <label htmlFor="password">Password:</label>
//                 <input
//                     type="password"
//                     id="password"
//                     name="password"
//                     value={formValues.password}
//                     onChange={handleChange}
//                 />
//                 {errors.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}
//             </div>
//             <button type="submit">Register</button>
//         </form>
//     );
// };

// export default RegistrationForm;


// export default function ValidateForm(fields, rules) {
//     const errors = {};
//     const minLength = 6;

//     Object.keys(fields).forEach(field => {

//         if (rules[field]) {
//             const rule = rules[field];

//             if (rule.required && !fields[field]) {
//                 errors[field] = `${field}이(가) 비어있습니다`;

//                 return errors;
//             }

//             if (rule.type === "email" && !/\S+@\S+\.\S+/.test(fields[field])) {
//                 errors[field] = "유효하지 않은 이메일 형식입니다.";

//                 return errors;
//             }

//             if (rule.type === "password" && fields[field].length < minLength) {
//                 errors[field] = `${field} 은(는) 최소 ${minLength} 자 이상 이어야 합니다.`;

//                 return errors;
//             }

//             if (rule.equalToPwd && fields[field] !== fields["pwd"]) {
//                 errors[field] = "입력한 패스워드와 같지 않습니다.";
//                 console.log(fields[field]);
//                 console.log(rules["pwd"]);

//                 return errors;
//             }
//         }
//     });

//     console.log(errors);

//     return errors;


