﻿using FluentValidation;
using Olx.BLL.Models;
using Olx.BLL.Resources;


namespace Olx.BLL.Validators
{
    public class EmailComfirmationModelValidator : AbstractValidator<EmailConfirmationModel>
    {
        public EmailComfirmationModelValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .EmailAddress().WithMessage(ValidationErrors.InvalidEmail);
            RuleFor(x => x.Token)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty);
        }
    }
}

