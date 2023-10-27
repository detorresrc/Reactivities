using FluentEmail.Core;
using FluentEmail.Core.Models;
using FluentEmail.Mailgun;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.EmailSender
{
    public class MailgunEmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;
        public MailgunEmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
         
            var apikey = _configuration["Mailgun:ApiKey"];
            var sender = new MailgunSender("rommeldetorres.me", apikey, MailGunRegion.USA);
            
            Email.DefaultSender = sender;
        }

        public async Task<SendResponse> SendEmailAsync(string email, string subject, string htmlMessage)
        {
            return await new Email()
                .SetFrom("noreply@rommeldetorres.me")
                .To(email)
                .Subject(subject)
                .Body(htmlMessage, true)
                .SendAsync();
        }
    }
}