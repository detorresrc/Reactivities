using FluentEmail.Core.Models;

namespace Infrastructure.EmailSender
{
    public interface IEmailSender
    {
        public Task<SendResponse> SendEmailAsync(string email, string subject, string htmlMessage);       
    }
}