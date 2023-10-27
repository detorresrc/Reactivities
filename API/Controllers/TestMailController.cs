using Infrastructure.EmailSender;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TestMailController : BaseApiController
    {
        private readonly IEmailSender _emailSender;
        public TestMailController(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        [AllowAnonymous]
        [HttpGet("sendtome")]
        public async Task<ActionResult> SendTestMail()
        {
            var response = await _emailSender.SendEmailAsync("detorresrc@gmail.com", "Test Email", "<p><strong>Ako lang to!</strong></p>");

            if(response.Successful)
                return Ok("Email sent");
            else
                return BadRequest(response.ErrorMessages);
        }
    }
}